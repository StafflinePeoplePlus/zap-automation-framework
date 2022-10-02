import {RiskCodeInterface} from './RiskCodeInterface'

export class RiskCode implements RiskCodeInterface{
    /**
     * @inheritDoc
     */
    code: number

    constructor(riskCode: number) {
        this.code = riskCode
    }

    /**
     * @inheritDoc
     */
    getCode(): number {
        return this.code
    }

    /**
     * @inheritDoc
     */
    getName(): string {
        switch (this.code) {
        case 0:
            return 'Informational'
        case 1:
            return 'Low'
        case 2:
            return 'Medium'
        case 3:
            return 'High'
        default:
            return 'Unknown'
        }
    }

    /**
     * @inheritDoc
     */
    getEmoji(): string {
        switch (this.code) {
        case 0:
            return ':information_source:'
        case 1:
            return ':large_blue_diamond:'
        case 2:
            return ':large_orange_diamond:'
        case 3:
            return ':bangbang:'
        default:
            return ':white_check_mark:'
        }
    }

    /**
     * @inheritDoc
     */
    isEqualTo(other: RiskCodeInterface): boolean {
        return this.code === other.code
    }
}
