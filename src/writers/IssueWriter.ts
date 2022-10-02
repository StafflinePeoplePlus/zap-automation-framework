import * as core from '@actions/core'
import {WriterInterface} from './WriterInterface'
import {ReportInterface} from '../reports/ReportInterface'

export class IssueWriter implements WriterInterface {
    issueTitle: string

    constructor(issueTitle: string) {
        this.issueTitle = issueTitle
    }


    write(report: ReportInterface): boolean {
        core.notice('Writing an issue is not yet implemented')
        return false
    }
}
