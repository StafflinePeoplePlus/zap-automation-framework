import * as exec from '@actions/exec'

/**
 * Pulls a docker image
 * @param {string} dockerImage The name of the image to be pulled
 */
export async function pullDockerImage(dockerImage: string): Promise<number>
{
    return exec.exec(`docker pull ${dockerImage}`)
}

/**
 * Creates and returns the docker command to be executed
 *
 * @param {string} dockerImage The docker image to be run.
 * @param {string} configDir The directory containing the configuration files of the automation framework.
 * @param {string} reportsDir The directory containing the reports created by the automation framework.
 * @param {string} autorunFile The actual automation framework configuration
 * @return {string} The docker command to be run
 */
export function getDockerCommand(dockerImage: string, configDir: string, reportsDir: string, autorunFile: string): string
{
    const workspace: string = process.env.GITHUB_WORKSPACE ?? ''
    const bashCmd = `/zap/zap.sh -cmd -autorun /zap/${configDir}/${autorunFile}`

    let dockerCmd = `docker run --mount type=bind,source=${workspace}/${configDir},target=:/zap/${configDir} `
    dockerCmd += `--mount type=bind,source=${workspace}/${reportsDir},target=:/zap/${reportsDir} `
    dockerCmd += `--network="host" -t ${dockerImage} ${bashCmd}`

    return dockerCmd
}
