import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { z } from 'zod'
import { FacadeService } from './facade.service';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  constructor(
    private http: HttpClient,
    private facadeService: FacadeService
  ) { }

  materiaSchema = z.object({
    nrc: z.number({
      message: 'El NRC es requerido'
    }).int('El NRC debe ser un número entero').positive('El NRC debe ser un número positivo'),
    nombre: z.string({
      message: 'El nombre de la materia es requerido',
    }),
    seccion: z.number({
      message: 'La sección es requerida'
    }).int('La sección debe ser un número entero').positive('La sección debe ser un número positivo'),
    dias: z.object({
      lunes: z.boolean(),
      martes: z.boolean(),
      miercoles: z.boolean(),
      jueves: z.boolean(),
      viernes: z.boolean()
    }),
    horario: z.object({
      startAt: z.string({
        message: 'La hora de inicio es requerida'
      }),
      endAt: z.string({
        message: 'La hora de fin es requerida'
      })
    }),
    salon: z.string({
      message: 'El salón es requerido'
    }),
    programaEducativo: z.enum(['Ingeniería en Ciencias de la Computación', 'Ingeniería en Tecnologías de la Información', 'Licenciatura en Ciencias de la Información'], {
      message: 'Seleccione un programa educativo'
    })
  })

  public get getSchema() {
    return this.materiaSchema
  }

  public validate(data: unknown) {
    const parsedData = this.materiaSchema.safeParse(data)
    if (parsedData.success) {
      const days = Object.entries(parsedData.data.dias)
      const isAnyDaySelected = days.some(([_, value]) => value)
      if (!isAnyDaySelected) {
        return {
          success: false,
          error: {
            flatten: () => ({
              fieldErrors: {
                dias: ['Seleccione al menos un día']
              }
            })
          },
          data: null
        }
      }

      const horarios = Object.values(parsedData.data.horario)

      let isEndAtAfterStartAt = true

      const startAt = {
        hour: parseInt(horarios[0].split(':')[0]),
        minute: parseInt(horarios[0].split(':')[1]),
        isAm: horarios[0].toLowerCase().includes('am')
      }

      const endAt = {
        hour: parseInt(horarios[1].split(':')[0]),
        minute: parseInt(horarios[1].split(':')[1]),
        isAm: horarios[1].toLowerCase().includes('am')
      }

      if (startAt.isAm && endAt.isAm) {
        isEndAtAfterStartAt = endAt.hour > startAt.hour || (endAt.hour === startAt.hour && endAt.minute > startAt.minute)
      } else if (!startAt.isAm && endAt.isAm) {
        isEndAtAfterStartAt = true
      } else if (startAt.isAm && !endAt.isAm) {
        isEndAtAfterStartAt = false
      } else {
        isEndAtAfterStartAt = endAt.hour > startAt.hour || (endAt.hour === startAt.hour && endAt.minute > startAt.minute)
      }

      if (!isEndAtAfterStartAt) {
        return {
          success: false,
          error: {
            flatten: () => ({
              fieldErrors: {
                horario: ['La hora de fin debe ser después de la hora de inicio']
              }
            })
          },
          data: null
        }
      }


    }
    return parsedData
  }

  private getAuthHeaders() {
    const token = this.facadeService.getSessionToken();
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
  }

  public insertMateria(payload: {
    dias: string[];
    horario: string[];
    nrc?: number | undefined;
    nombre?: string | undefined;
    seccion?: number | undefined;
    salon?: string | undefined;
    programaEducativo?: "Ingeniería en Ciencias de la Computación" | "Ingeniería en Tecnologías de la Información" | "Licenciatura en Ciencias de la Información" | undefined;
  }) {
    return this.http.post(`${environment.url_api}/materia/`, payload)
  }

  public updateMateria(id: number, payload: {
    dias: string[];
    horario: string[];
    nrc?: number | undefined;
    nombre?: string | undefined;
    seccion?: number | undefined;
    salon?: string | undefined;
    programaEducativo?: "Ingeniería en Ciencias de la Computación" | "Ingeniería en Tecnologías de la Información" | "Licenciatura en Ciencias de la Información" | undefined;
  }) {
    const headers = this.getAuthHeaders();
    return this.http.put(`${environment.url_api}/materia/?id=${id}`, payload, { headers })
  }

  public selectMaterias() {
    const headers = this.getAuthHeaders();
    return this.http.get(`${environment.url_api}/materias/`, { headers })
  }

  public selectMateria(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.get(`${environment.url_api}/materia/?id=${id}`, { headers })
  }

  public deleteMateria(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${environment.url_api}/materia/?id=${id}`, { headers })
  }

  public getStats(query: string) {
    const headers = this.getAuthHeaders();
    return this.http.get(`${environment.url_api}/materias/stats/?countBy=${query}`, { headers })
  }

  public parseHorarios(horarios: unknown) {

    if (!Array.isArray(horarios)) {
      return null
    }

    const parsedHorarios = {
      startAt: horarios[0],
      endAt: horarios[1]
    }
    return parsedHorarios
  }

  public parseDias(dias: string[]) {
    const parsedDias = {
      lunes: dias.includes('lunes'),
      martes: dias.includes('martes'),
      miercoles: dias.includes('miercoles'),
      jueves: dias.includes('jueves'),
      viernes: dias.includes('viernes')
    }
    return parsedDias
  }
}
