/* eslint-disable no-prototype-builtins */
import {AlertInstanceInterface} from './AlertInstanceInterface'

export class AlertInstance implements AlertInstanceInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(instanceData: any) {
        this.uri = instanceData.hasOwnProperty('uri') ? instanceData['uri'] : ''
        this.method = instanceData.hasOwnProperty('method')
            ? instanceData['method']
            : ''
        this.param = instanceData.hasOwnProperty('param')
            ? instanceData['param']
            : ''
        this.evidence = instanceData.hasOwnProperty('evidence')
            ? instanceData['evidence']
            : ''
        this.otherInfo = instanceData.hasOwnProperty('otherinfo')
            ? instanceData['otherinfo']
            : ''
    }

    uri: string
    method: string
    param: string
    evidence: string
    otherInfo: string

    getURI(): string {
        return this.uri
    }

    getMethod(): string {
        return this.method
    }

    getParam(): string {
        return this.param
    }

    getEvidence(): string {
        return this.evidence
    }

    getOtherInfo(): string {
        return this.otherInfo
    }
}
