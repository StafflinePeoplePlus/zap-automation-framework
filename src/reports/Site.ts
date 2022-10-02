/* eslint-disable no-prototype-builtins */
import {Alert} from './Alert'
import {AlertInterface} from './AlertInterface'
import {SiteInterface} from './SiteInterface'

export class Site implements SiteInterface
{
    name: string
    host: string
    port: number
    ssl: boolean
    alerts?: Array<AlertInterface>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(site: any) {
        this.name = site.hasOwnProperty('@name') ? site['@name'] : ''
        this.host = site.hasOwnProperty('@host') ? site['@host'] : ''
        this.port = site.hasOwnProperty('@port') ? parseInt(site['@port']) : 0
        this.ssl = site.hasOwnProperty('@ssl') ? site['@ssl'] === true : false

        if (site.hasOwnProperty('alerts'))
        {
            this.alerts = []
            for (const a of site['alerts']) {
                this.alerts.push(new Alert(a))
            }
        }
    }

    getAlerts(): Array<Alert> | undefined {
        return this.alerts
    }

    getHost(): string {
        return this.host
    }

    getName(): string {
        return this.name
    }

    getPort(): number | undefined {
        return this.port
    }

    isEqualTo(other: SiteInterface): boolean {
        return this.host === other.host &&
            this.port === other.port &&
            this.ssl === other.ssl
    }

    isSSL(): boolean {
        return this.ssl
    }
}
