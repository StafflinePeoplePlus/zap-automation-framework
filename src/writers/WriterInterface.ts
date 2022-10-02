import {ReportInterface} from '../reports/ReportInterface'

export interface WriterInterface
{
    /**
     * Writes a report.
     *
     * @param {ReportInterface} report The report to be written
     */
    write(report: ReportInterface): Promise<boolean>;
}
