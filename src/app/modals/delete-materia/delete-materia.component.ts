import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriaService } from 'src/app/services/materia.service';

@Component({
  selector: 'app-delete-materia',
  templateUrl: './delete-materia.component.html',
  styleUrls: ['./delete-materia.component.scss']
})
export class DeleteMateriaComponent {

  materia = ''
  actionName: 'Eliminar' | 'Modificar' = 'Eliminar'

  constructor(
    private dialogRef: MatDialogRef<DeleteMateriaComponent>,
    private materiaService: MateriaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.materia = this.data.materia;
    this.actionName = this.data.actionName;
  }

  public cerrar_modal() {
    this.dialogRef.close({ isDelete: false });
  }

  public acceptAction() {
    if (this.actionName === 'Eliminar') {
      this.eliminarUser()
    } else {
      this.updateMateria()
    }
  }

  public eliminarUser() {
    this.materiaService.deleteMateria(this.data.id).subscribe({
      complete: () => {
        alert('Materia eliminada correctamente')
        this.dialogRef.close({ isDelete: true });
      },
      error: (error) => {
        alert('Ocurrió un error al eliminar la materia')
        console.error(error)
        this.dialogRef.close({ isDelete: false });
      }
    })
  }

  public updateMateria() {
    this.materiaService.updateMateria(Number(this.data.id), this.data.payload).subscribe({
      complete: () => {
        alert('Materia actualizada con éxito')
        this.dialogRef.close({ isDelete: true });
      },
      error: (error) => {
        alert('Ocurrió un error al actualizar la materia')
        console.error(error)
        this.dialogRef.close({ isDelete: false });
      }
    })
  }
}
