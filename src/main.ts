import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as fs from 'fs'
import {pullDockerImage, getDockerCommand, copyFilesFromDocker} from './docker'
import {buildAndUploadArtifact} from './artifact'
import {ReportInterface} from './reports/ReportInterface'
import {Report} from './reports/Report'
import {WriterInterface} from './writers/WriterInterface'
import {AnnotationWriter} from './writers/AnnotationWriter'
import {IssueWriter} from './writers/IssueWriter'

function checkAutorunFile(configDir: string, autorunFile: string): void {
    const workspace: string = process.env.GITHUB_WORKSPACE ?? ''
    const exists: boolean = fs.existsSync(`${workspace}/${configDir}/${autorunFile}`)

    if (!exists) {
        throw new Error('Autorun configuration does not exist in the specified path!')
    }
}

async function run(): Promise<void> {
    try {
        const workspace: string = process.env.GITHUB_WORKSPACE ?? ''
        const configDir: string = core.getInput('config-dir')
        const autorunFile: string = core.getInput('autorun-file')
        const dockerImage: string = core.getInput('docker-image')
        const createIssue: boolean = core.getBooleanInput('create-issue')
        const summaryFile: string = core.getInput('summary-file')
        const jsonFile: string = core.getInput('json-file')
        const issueTitle: string = core.getInput('issue-title')
        const createAnnotations: boolean = core.getBooleanInput('create-annotations')
        const reportsDir = '/home/runner/.zap/reports'

        try {
            await io.mkdirP(reportsDir)
        } catch (error) {
            core.setFailed(`Unable to create dir ${reportsDir}`)
        }

        let artifactName = ''

        checkAutorunFile(configDir, autorunFile)
        core.startGroup('Pulling ZAP Image')
        await pullDockerImage(dockerImage)
        core.endGroup()

        core.startGroup('Scan Execution')
        try {
            await exec.exec(
                'chmod',
                ['2777', reportsDir]
            )
            /*await exec.exec(
                'docker',
                ['volume', 'create', 'zap-volume']
            )*/
            await exec.exec(
                'docker',
                [
                    'run',
                    '--mount',
                    `type=bind,source=${workspace}/${configDir}/,target=/zap/${configDir}/`,
                    '--mount',
                    `type=bind,source=${reportsDir}:/zap/reports/`,
                    '--network="host"',
                    '-t',
                    `/bin/bash -c "/zap/zap.sh -cmd -autorun=/zap/${configDir}/${autorunFile}"`
                ]
            )
        } catch (error) {
            if (error instanceof Error)
            {
                core.error(error.message)
            }
        }
        core.endGroup()

        core.startGroup('Processing reports')

        const uploaded = await buildAndUploadArtifact(reportsDir)
        if (uploaded !== null) {
            artifactName = uploaded.artifactName
            core.info(`Build artifact was created: ${artifactName}`)
        }

        if (!createIssue && !createAnnotations) {
            core.endGroup()
            return
        }

        const reportObj: ReportInterface = new Report(
            `${reportsDir}/${summaryFile}`,
            `${reportsDir}/${jsonFile}`
        )

        let reportWritersResult = false

        if (createAnnotations) {
            const annotationWriter: WriterInterface = new AnnotationWriter()
            reportWritersResult ||= await annotationWriter.write(reportObj)
        }

        if (createIssue) {
            const issueWriter: WriterInterface = new IssueWriter(issueTitle)
            reportWritersResult ||= await issueWriter.write(reportObj)
        }

        if (!reportWritersResult) {
            core.warning('No reports were written although it was specified in the configuration!')
        }
        core.endGroup()

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()
