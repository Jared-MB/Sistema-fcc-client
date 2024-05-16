// type ProgramaEducativo =
//     'Ingeniería en Ciencias de la Computación' |
//     'Ingeniería en Tecnologías de la Información' |
//     'Licenciatura en Ciencias de la Información'

export enum ProgramaEducativo {
    ICC = 'Ingeniería en Ciencias de la Computación',
    ITI = 'Ingeniería en Tecnologías de la Información',
    LCI = 'Licenciatura en Ciencias de la Información'
}

export const ProgramasEducativos = [
    ProgramaEducativo.ICC,
    ProgramaEducativo.ITI,
    ProgramaEducativo.LCI
]

export interface Materia {
    nrc: number;
    nombre: string;
    seccion: number;
    dias: string[];
    horario: string[];
    salon: string;
    programaEducativo: ProgramaEducativo
}