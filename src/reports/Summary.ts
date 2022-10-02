/* eslint-disable */
import {SummaryInterface} from './SummaryInterface'

export class Summary implements SummaryInterface
{
    pass: number
    warn: number
    fail: number

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(summaryData: any) {
        this.pass = summaryData.hasOwnProperty('pass') ? parseInt(summaryData['pass']) : 0
        this.warn = summaryData.hasOwnProperty('warn') ? parseInt(summaryData['warn']) : 0
        this.fail = summaryData.hasOwnProperty('fail') ? parseInt(summaryData['fail']) : 0
    }

    getPasses(): number
    {
        return this.pass
    }

    getWarnings(): number
    {
        return this.warn
    }

    getFailures(): number
    {
        return this.fail
    }

    hasFailures(): boolean
    {
        return this.fail > 0
    }

    hasWarningsOrFailures(): boolean
    {
        return this.fail > 0 || this.warn > 0
    }

    isEqualTo(other: SummaryInterface): boolean {
        return this.pass === other.pass &&
            this.warn === other.warn &&
            this.fail === other.fail
    }
}
