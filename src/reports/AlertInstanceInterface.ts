export interface AlertInstanceInterface {
    /**
     * URL of where the alert was raised
     */
    uri: string

    /**
     * HTTP method
     */
    method: string

    /**
     * The parameter that was checked
     */
    param: string

    /**
     * Value relevent to the alert that may be used as evidence for the alert
     */
    evidence: string

    /**
     * More information about the alert
     */
    otherInfo: string

    getURI(): string
    getMethod(): string
    getParam(): string
    getEvidence(): string
    getOtherInfo(): string
}
