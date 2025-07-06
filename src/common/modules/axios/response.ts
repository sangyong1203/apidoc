import { assign, get, isNil } from 'lodash'
import camelcaseKeys from 'camelcase-keys'
import type { AxiosResponse } from 'axios'

export class APIResponse {
    public result = 0
    public status = 0
    public message = ''
    public data: any | null = null

    constructor(res?: Partial<AxiosResponse>) {
        if (isNil(res)) {
            console.error(`[Response error]: Response Undefined\n${res}`)
            return
        }
        const result = get(res.data, 'result')
        assign(this, camelcaseKeys(result ? res.data : { data: res.data }))

        if (isNil(result)) {
            this.result = res.status === 200 ? 200 : 0
        }
    }
}

export const ErrorResponse = () => new APIResponse()
