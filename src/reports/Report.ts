import * as core from '@actions/core'
import * as fs from 'fs'
import {Site} from './Site'
import {Summary} from './Summary'
import {ReportInterface} from './ReportInterface'

export class Report implements ReportInterface {
    /**
     * @inheritDoc
     */
    summaryFile: string

    /**
     * @inheritDoc
     */
    jsonFile: string

    /**
     * @inheritDoc
     */
    sites?: Array<Site>

    /**
     * @inheritDoc
     */
    summary?: Summary

    constructor(
        summaryFile: string,
        jsonFile: string
    ) {
        this.summaryFile = summaryFile
        this.jsonFile = jsonFile

        fs.readFile(summaryFile, 'utf-8', (err, data) => {
            if (err) {
                core.warning('Unable to read summary report file')
                throw new Error('Unable to read summary report file')
            }
            console.log(data)
            const summaryData = JSON.parse(data)
            this.summary = new Summary(summaryData)
        })

        fs.readFile(jsonFile, 'utf-8', (err, data) => {
            if (err) {
                core.warning('Unable to read traditional json report file')
                return
            }

            const detailedData = JSON.parse(data)
            console.log(data)
            // eslint-disable-next-line no-prototype-builtins
            if (detailedData.hasOwnProperty('site')) {
                this.sites = []

                const sites = detailedData['site']

                for (const s of sites) {
                    const siteObj = new Site(s)
                    this.sites?.push(siteObj)
                }
            }
        })
    }

    /**
     * @inheritDoc
     */
    getSummaryFile(): string {
        return this.summaryFile
    }

    /**
     * @inheritDoc
     */
    getJsonFile(): string {
        return this.jsonFile
    }
}
