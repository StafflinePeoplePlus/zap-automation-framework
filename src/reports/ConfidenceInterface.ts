import {EqutableInterface} from '../EqutableInterface'

export interface ConfidenceInterface extends EqutableInterface
{
    /**
     * Confidence level as reported by ZAP
     */
    confidence: number

    /**
     * Returns the confidence level as reported by ZAP
     */
    getConfidence(): number

    /**
     * Returns a human-readable name of the confidence object
     */
    getName(): string
}
