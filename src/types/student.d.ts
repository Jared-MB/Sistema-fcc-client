import { type Generic } from "./generic";

export interface Student extends Generic {
    dateOfBirth: Date
    curp: string
    rfc: string
    age: number
    occupation: string
}