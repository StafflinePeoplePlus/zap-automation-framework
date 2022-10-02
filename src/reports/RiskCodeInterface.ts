import {EqutableInterface} from '../EqutableInterface'

export interface RiskCodeInterface extends EqutableInterface
{
    /**
     * The Risk Code as reported by ZAP.
     */
    code: number

    /**
     * Returns the Risk Code as reported by ZAP.
     */
    getCode(): number;

    /**
     * Returns a human-readable representation of the Risk Code.
     */
    getName(): string;

    /**
     * Returns a string representing a GitHub emoji, which is associated with the risk code
     */
    getEmoji(): string
}
