import {EqutableInterface} from '../EqutableInterface'
import {Alert} from './Alert'

export interface SiteInterface extends EqutableInterface
{
    /**
     * The name of the Scanned Site
     */
    name: string;
    /**
     * The scanned host
     */
    host: string;

    /**
     * The port of the webserver scanned
     */
    port?: number

    /**
     * Whether the connection was using SSL
     */
    ssl: boolean

    /**
     * An array of Alert objects as reported by the scanner
     */
    alerts?: Array<Alert>

    /**
     * Returns the name of the scanned site
     */
    getName(): string

    /**
     * Returns the host of the scanned site
     */
    getHost(): string

    /**
     * Returns the port of the scanned site
     */
    getPort(): number | undefined

    /**
     * Returns whether the scanned site supports SSL
     */
    isSSL(): boolean

    /**
     * Returns an array of Alert objects, as reported by the scanner
     */
    getAlerts(): Array<Alert> | undefined

}
