import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteMateriaComponent } from 'src/app/modals/delete-materia/delete-materia.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriaService } from 'src/app/services/materia.service';
import { Materia, ProgramasEducativos } from 'src/types/materia';
import { z } from 'zod'

@Component({
  selector: 'app-registro-materias-form',
  templateUrl: './registro-materias-form.component.html',
  styleUrls: ['./registro-materias-form.component.scss']
})
export class RegistroMateriasFormComponent implements OnInit {

  private id: null | number = null

  @Input({
    required: false
  }) edit = false

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private materiaService: MateriaService,
    private activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,

    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (this.edit) {
      this.id = this.activatedRoute.snapshot.queryParams['id']
      if (isNaN(Number(this.id))) {
        alert('El id proporcionado no es válido')
        this.back()
        return
      }
      this.materiaService.selectMateria(Number(this.id)).subscribe({
        next: (materia) => {
          const horario = this.materiaService.parseHorarios((materia as any).horario)
          const dias = this.materiaService.parseDias((materia as any).dias)
          const materiaFromDB = {
            ...materia,
            programaEducativo: (materia as any).programa_educativo,
            horario,
            dias
          }
          const parsedMateria = this.materiaService.validate(materiaFromDB)
          if (!parsedMateria.success || parsedMateria.data === null) {
            alert('Ocurrió un error al obtener la materia')
            console.error(parsedMateria.error)
            this.back()
            return
          }
          this.materia = parsedMateria.data
          this.dias.setValue({
            lunes: dias.lunes,
            martes: dias.martes,
            miercoles: dias.miercoles,
            jueves: dias.jueves,
            viernes: dias.viernes
          })
        },
        error: (error) => {
          alert('Ocurrió un error al obtener la materia')
          console.error(error)
          this.back()
        }

      })
    }
  }

  public programasEducativos = ProgramasEducativos

  public errors = {} as {
    nrc?: string[] | undefined;
    nombre?: string[] | undefined;
    seccion?: string[] | undefined;
    dias?: string[] | undefined;
    horario?: string[] | undefined;
    salon?: string[] | undefined;
    programaEducativo?: string[] | undefined;
  }

  public materia = {
    horario: {}
  } as z.infer<typeof this.materiaService.getSchema>

  public dias = this._formBuilder.group({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false
  });

  public handleSubmit() {
    const parsedData = this.materiaService.validate({
      ...this.materia,
      dias: this.dias.value
    })
    if (!parsedData.success) {
      this.errors = parsedData.error.flatten().fieldErrors
      return
    }
    const days = Object.entries(this.dias.value)
    const workingDays = days.filter(([_, value]) => value).map(([day]) => day)

    const hours = Object.entries(this.materia.horario)
    const hoursArray = hours.map(([_, value]) => value)

    const payload = {
      ...parsedData.data,
      dias: workingDays,
      horario: hoursArray
    }
    const rol = this.facadeService.getUserGroup()


    if (this.edit) {

      if (rol !== 'administrador') {
        alert('No tienes permisos para modificar materias')
        return
      }

      if (this.id === null) {
        alert('Ocurrió un error al obtener el id de la materia a editar')
        this.back()
        return
      }
      const id = this.id
      const dialogRef = this.dialog.open(DeleteMateriaComponent, {
        data: { id, materia: parsedData.data?.nombre, actionName: 'Modificar', payload }, //Se pasan valores a través del componente
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.isDelete) {
          //Recargar página
          this.back()
        }
      });

      return
    }

    if (rol !== 'administrador') {
      alert('No tienes permisos para registrar materias')
      return
    }

    this.materiaService.insertMateria(payload).subscribe({
      complete: () => {
        alert('Materia registrada con éxito')
        this.back()
      },
      error: (error) => {
        alert('Ocurrió un error al registrar la materia')
        console.error(error)
      }
    })
  }

  public back() {
    this.router.navigate(['/materias'])
  }
}
