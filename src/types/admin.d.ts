import { Generic } from "./generic"

export interface Admin extends Generic {
    adminId: string
    rfc: string
    age: number
    occupation: string
}