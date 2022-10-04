import * as artifact from '@actions/artifact'
import * as glob from '@actions/glob'
import * as fs from 'fs'

function checkReportsDirectory(dir: string): boolean {
    return (fs.existsSync(dir))
}

async function getFileList(dir: string) {
    const fileObj = await glob.create(`${dir}/**`, {followSymbolicLinks: false})
    const files = await fileObj.glob()

    return (files.length > 0) ? files : null
}

export async function buildAndUploadArtifact(reportsDir: string) {
    const rootDirectory = reportsDir

    if (!checkReportsDirectory(rootDirectory)) {
        return null
    }

    const fileList = await getFileList(rootDirectory)

    if (fileList === null) {
        return null
    }

    const artifactClient = artifact.create()
    const artifactName = 'zap-reports'
    const options = {
        continueOnError: true,
        retentionDays: 30
    }
    return await artifactClient.uploadArtifact(artifactName, fileList, rootDirectory, options)
}
