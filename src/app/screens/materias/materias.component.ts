import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteMateriaComponent } from 'src/app/modals/delete-materia/delete-materia.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriaService } from 'src/app/services/materia.service';
import { type Materia } from 'src/types/materia';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss'],
})
export class MateriasComponent {

  public name_user = "";
  public role = "";
  public listaMaterias = [] as Materia[]

  displayedColumns = ['nrc', 'nombre', 'seccion', 'dias', 'horario', 'salon', 'programaEducativo', 'opciones']
  public dataSource = new MatTableDataSource<Materia>(this.listaMaterias)

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public facadeService: FacadeService,
    public materiaService: MateriaService,
    public dialog: MatDialog,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.role = this.facadeService.getUserGroup();
    if (this.role !== 'administrador') {
      const columns = this.displayedColumns.filter(column => column !== 'opciones')
      this.displayedColumns = columns
    }
    this.name_user = this.facadeService.getUserCompleteName();
    this.materiaService.selectMaterias().subscribe({
      next: (materias) => {
        this.listaMaterias = Object.values(materias)
        this.dataSource = new MatTableDataSource<Materia>(this.listaMaterias)
      }
    })
    this.initPaginator()
  }

  public initPaginator() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    }, 500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

  public edit(id: number) {
    this.router.navigate(["materias/edit"], {
      queryParams: { id }
    })
  }

  public delete(id: number, name: string) {
    const dialogRef = this.dialog.open(DeleteMateriaComponent, {
      data: { id, materia: name, actionName: 'Eliminar' }, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isDelete) {
        //Recargar página
        window.location.reload();
      }
    });
  }
}
