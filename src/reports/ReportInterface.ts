import {Site} from './Site'
import {Summary} from './Summary'

export interface ReportInterface {

    /**
     * The full path to the file produced by the outputSummary job.
     *
     * @since 0.1.0
     */
    summaryFile: string;

    /**
     * The full path to a file containing the `traditional-json` report.
     * @since 0.1.0
     */
    jsonFile: string;

    /**
     * An array of report data regarding the Sites scanned by the tool
     */
    sites?: Array<Site>

    /**
     * A summary object created by the outputSummary file
     */
    summary?: Summary

    /**
     * Return the full path to the summary file
     */
    getSummaryFile(): string;

    /**
     * Returns the full path to the actual report file
     */
    getJsonFile(): string
}
