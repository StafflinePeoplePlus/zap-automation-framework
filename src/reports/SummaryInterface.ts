import {EqutableInterface} from '../EqutableInterface'

export interface SummaryInterface extends EqutableInterface
{
    /**
     * Number of rules that reported pass
     */
    pass: number;

    /**
     * Number of rules that indicated warning
     */
    warn: number;

    /**
     * Number of rules that indicated failure
     */
    fail: number

    getPasses(): number
    getWarnings(): number
    getFailures(): number
    hasFailures(): boolean
    hasWarningsOrFailures(): boolean
}
