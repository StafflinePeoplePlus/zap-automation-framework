import {RiskCodeInterface} from './RiskCodeInterface'
import {ConfidenceInterface} from './ConfidenceInterface'

export interface AlertInterface
{
    /**
     * The Plugin ID
     */
    pluginId: string

    /**
     * The Alert Reference
     */
    alertRef: string

    /**
     * The actual alert
     */
    alert: string

    /**
     * The name of the alert
     */
    name: string

    /**
     * A {@see RiskCodeInterface} object that contains information about the Risk
     */
    riskCode: RiskCodeInterface

    /**
     * A {@see ConfidenceInterface} object that contains information about the tool's confidence
     */
    confidence: ConfidenceInterface

    /**
     * The description of the risk as provided by ZAP (Risk Code and Confidence)
     */
    riskDesc: string

    /**
     * The description of the Alert (HTML)
     */
    description: string

    /**
     * Count of alerts of this type
     */
    count: number

    /**
     * A solution text provided by ZAP
     */
    solution: string

    /**
     * Other information provided by ZAP
     */
    otherInfo: string

    /**
     * A reference to this alert provided by ZAP
     */
    reference: string

    /**
     * The Common Weakness Enumeration identifier
     */
    cweId: string

    /**
     * The Web Application Security Consortium Identifier
     */
    wascId: string

    /**
     * Source ID provided by ZAP
     */
    sourceId: string

    getPluginId(): string
    getAlertRef(): string
    getAlert(): string
    getName(): string
    getRiskCode(): RiskCodeInterface
    getConfidence(): ConfidenceInterface
    getRiskDescription(): string
    getDescription(): string
    getCount(): number
    getSolution(): string
    getOtherInfo(): string
    getReference(): string
    getCWEID(): string
    getWASCID(): string
    getSourceID(): string
}
