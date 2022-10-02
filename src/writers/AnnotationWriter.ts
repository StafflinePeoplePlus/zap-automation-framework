import * as core from '@actions/core'
import {AnnotationProperties} from '@actions/core'

import {WriterInterface} from './WriterInterface'
import {ReportInterface} from '../reports/ReportInterface'
import {SummaryInterface} from '../reports/SummaryInterface'
import {Site} from '../reports/Site'
import {SiteInterface} from '../reports/SiteInterface'

export class AnnotationWriter implements WriterInterface {

    async write(report: ReportInterface): Promise<boolean> {
        let result = false

        if (report.summary) {
            this.writeSummary(report.summary)
            result = true
        }

        if (report.sites !== undefined && report.sites.length > 0) {
            this.writeFullReport(report.sites)
            result = true
        }

        return new Promise<boolean>(resolve => result)
    }

    private writeSummary(summary: SummaryInterface): void {
        if (summary.fail > 0) {
            core.error(`The scanner reported ${summary.fail} failures. See the build artifacts for more information`)
        }

        if (summary.warn > 0) {
            core.warning(`The scanner reported ${summary.warn} failures. See the build artifacts for more information`)
        }
    }

    private writeFullReport(sites: Array<Site>): void {
        for (const site of sites)
        {
            const siteAlerts = site.getAlerts()
            if (siteAlerts === undefined || siteAlerts.length === 0) {
                continue
            }

            for (const alert of siteAlerts) {
                const annotation = `[${site.getName()}]: ${alert.getRiskDescription()} ${alert.getName()} (Encountered: ${alert.getCount()})`

                switch (alert.getRiskCode().getCode())
                {
                case 3:
                    core.error(annotation)
                    break
                case 2:
                    core.warning(annotation)
                    break
                default:
                    core.notice(annotation)
                    break
                }
            }
        }
    }
}
