import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MateriaService } from 'src/app/services/materia.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  //Agregar chartjs-plugin-datalabels
  //Variables
  //Histograma
  lineChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [98, 34, 43, 54, 28, 74, 93],
        label: 'Registro de materias',
        backgroundColor: '#F88406'
      }
    ]
  }
  lineChartOption = {
    responsive: false
  }
  lineChartPlugins = [DatalabelsPlugin];

  //Barras
  barChartData = {
    labels: ["Desarrollo Web", "Minería de Datos", "Redes", "Móviles", "Matemáticas"],
    datasets: [
      {
        data: [34, 43, 54, 28, 74],
        label: 'Registro de materias',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  barChartOption = {
    responsive: false
  }
  barChartPlugins = [DatalabelsPlugin];

  //Circular
  //Circular
  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive: false
  }
  pieChartPlugins = [DatalabelsPlugin];

  // Doughnut
  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [89, 34, 43],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive: false
  }
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService,
    private materiaService: MateriaService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
    this.getMateriasStats();
  }

  public getMateriasStats() {
    this.materiaService.getStats('days').subscribe({
      next: (response) => {
        const { lunes, martes, miercoles, jueves, viernes } = response as any
        this.lineChartData = {
          ...this.lineChartData,
          datasets: [{
            ...this.lineChartData.datasets[0],
            data: [lunes, martes, miercoles, jueves, viernes]
          }]
        }
      },
      error: (error) => {
        alert("No se pudo obtener las estadísticas de materias");
      }

    })
    this.materiaService.getStats('teachers').subscribe({
      next: (response) => {
        // const { DesarrolloWeb, MineríaDeDatos, Redes, Móviles, Matemáticas } = response as any
        // this.barChartData = {
        //   ...this.barChartData,
        //   datasets: [{
        //     ...this.barChartData.datasets[0],
        //     data: [DesarrolloWeb, MineríaDeDatos, Redes, Móviles, Matemáticas]
        //   }]
        // }
        console.log(response)
        this.barChartData = {
          ...this.barChartData,
          labels: Object.keys(response),
          datasets: [{
            ...this.barChartData.datasets[0],
            data: Object.values(response)
          }]
        }
      },
      error: (error) => {
        alert("No se pudo obtener las estadísticas de materias");
      }
    })
  }

  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      {
        next: (response) => {
          this.pieChartData = {
            ...this.pieChartData,
            datasets: [{
              ...this.pieChartData.datasets[0],
              data: [response.admins, response.maestros, response.alumnos]
            }]
          }
          this.doughnutChartData = {
            ...this.doughnutChartData,
            datasets: [{
              ...this.doughnutChartData.datasets[0],
              data: [response.admins, response.maestros, response.alumnos]
            }]
          }
          // this.pieChartData.datasets[0].data = [this.total_user.admins, this.total_user.maestros, this.total_user.alumnos];

        },
        error: (error) => {
          alert("No se pudo obtener el total de cada rol de usuarios");
        }
      }
    );
  }
}
