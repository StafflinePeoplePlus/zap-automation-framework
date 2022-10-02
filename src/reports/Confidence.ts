import {ConfidenceInterface} from './ConfidenceInterface'

export class Confidence implements ConfidenceInterface
{
    /**
     * @inheritDoc
     */
    confidence: number

    constructor(confidence: number) {
        this.confidence = confidence
    }

    /**
     * @inheritDoc
     */
    getConfidence(): number
    {
        return this.confidence
    }

    /**
     * @inheritDoc
     */
    getName(): string
    {
        switch (this.confidence)
        {
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
     * @param {ConfidenceInterface} other
     */
    isEqualTo(other: ConfidenceInterface): boolean
    {
        return this.confidence === other.confidence
    }
}
