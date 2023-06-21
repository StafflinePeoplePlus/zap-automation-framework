import * as core from '@actions/core'
import {WriterInterface} from './WriterInterface'
import {ReportInterface} from '../reports/ReportInterface'
import {AlertInterface} from '../reports/AlertInterface'
import {SiteInterface} from '../reports/SiteInterface'
import * as github from '@actions/github'
import {AlertInstanceInterface} from '../reports/AlertInstanceInterface'

export class IssueWriter implements WriterInterface {
    issueTitle: string

    constructor(issueTitle: string) {
        this.issueTitle = issueTitle
    }

    async write(report: ReportInterface): Promise<boolean> {
        const token = core.getInput('token')
        const octoKit = github.getOctokit(token)
        const context = github.context
        const issues = await octoKit.rest.search.issuesAndPullRequests({
            q: encodeURI(
                `is:issue state:open repo:${context.repo.owner}/${context.repo.repo} ${this.issueTitle}`
            ).replace(/%20/g, '+'),
            sort: 'updated'
        })

        const existingIssue = issues.data.items.find(
            issue => issue.title === this.issueTitle
        )
        if (report.summary && !report.summary.hasWarningsOrFailures()) {
            if (existingIssue) {
                await octoKit.rest.issues.createComment({
                    ...context.repo,
                    issue_number: existingIssue.number,
                    body: 'All warnings and errors have been fixed!'
                })
                await octoKit.rest.issues.update({
                    ...context.repo,
                    issue_number: existingIssue.number,
                    state: 'closed'
                })
            }
            return true
        }

        const markdown = this.produceMarkdown(report)

        try {
            if (existingIssue) {
                await octoKit.rest.issues.update({
                    ...context.repo,
                    issue_number: existingIssue.number,
                    body: markdown
                })
            } else {
                await octoKit.rest.issues.create({
                    ...context.repo,
                    title: this.issueTitle,
                    body: markdown
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                core.warning(error.message)
            }
        }

        return true
    }

    produceMarkdown(report: ReportInterface): string {
        let markdown = '# ZAP Scan Results\n\n'

        if (report.summary !== undefined) {
            markdown += `
### Summary

- Passed: **${report.summary.pass}**
- Warnings: **${report.summary.warn}**
- Failed: **${report.summary.fail}**

`
        }

        if (report.sites !== undefined && report.sites.length > 0) {
            for (const site of report.sites) {
                markdown += this.getSiteAlerts(site)
            }
        }

        return markdown
    }

    private getSiteAlerts(site: SiteInterface): string {
        let markdown = `## Report for ${site.name}`

        if (site.alerts !== undefined && site.alerts.length > 0) {
            for (const alert of site.alerts) {
                if (alert.getRiskDescription().includes('False Positive')) {
                    continue
                }
                markdown += this.getAlertText(alert)
            }
        }

        return markdown
    }

    private getAlertText(alert: AlertInterface): string {
        return `
### ${alert.riskCode.getEmoji()} ${alert.getName()} (${alert.getRiskDescription()}) &mdash; ${
            alert.count
        } Occurrences

<details>
<summary>See details</summary>

Ref: \`${alert.alertRef}\`

### Description

${alert.description}

---

### Solution

${alert.solution}

---

### Other Info

${alert.otherInfo}
</details>

<details>
<summary>See instances</summary>

${this.getAlertInstancesText(alert.instances)}
</details>



`
    }

    private getAlertInstancesText(instances: AlertInstanceInterface[]): string {
        return `
${instances.map(i => this.getAlertInstanceText(i)).join('\n')}
`
    }

    private getAlertInstanceText(instance: AlertInstanceInterface): string {
        const param = instance.param && `- \`${instance.param}\``
        return `- **${instance.method}** ${instance.uri} ${param}
  <details>
    <summary>See Details</summary>

   ##### Evidence
   \`\`\`
   ${instance.evidence.replace(/\r?\n/g, '\r  ')}
   \`\`\`

   ##### Other Info
   ${instance.otherInfo.replace(/\r?\n/g, '\r  ')}
  </details>`
    }
}
