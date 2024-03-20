import { type Generic } from "./generic";

type InvestigationArea = 'webDevelopment' | 'programming' | 'dataBases' | 'networks' | 'maths'
type Subjects = 'webApps' | 'programming_1' | 'dataBases' | 'webTech' | 'dataMining' | 'mobileDevelopment' | 'dataStructures' | 'networkAdmin' | 'softwareEngineering' | 'operativeSystemsAdmin'

export interface Teacher extends Generic {
    workerId: string
    dateOfBirth: Date
    cubicle: string
    investigationArea: InvestigationArea
    subjects: Subjects[]
}