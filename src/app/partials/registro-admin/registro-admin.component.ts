import { Component, Input, OnInit } from '@angular/core';
import { AdministradoresService } from '../../services/administradores.service';
import { Router } from '@angular/router';
//Para poder usar jquery definir esto
declare var $: any;

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit {
  @Input() rol: string = "";

  public admin: any = {};
  public editar: boolean = false;
  public errors: any = {};
  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private administradoresService: AdministradoresService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //Definir el esquema a mi JSON
    this.admin = this.administradoresService.esquemaAdmin();
    this.admin.rol = this.rol;
    console.log("Admin: ", this.admin);

  }

  public regresar() {

  }

  public registrar() {
    //Validar
    this.errors = [];

    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar)
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    if (this.admin.password !== this.admin.confirmar_password) {
      this.errors["password"] = "Las contraseñas no coinciden";
      this.errors["confirmar_password"] = "Las contraseñas no coinciden";
      return false;
    }

    this.administradoresService.registrarAdmin(this.admin).subscribe({
      next: (response) => {
        console.log("Respuesta del servidor: ", response);
        alert('Administrador registrado con éxito')
        this.router.navigate(['/']);
      },
      error: error => {
        alert('Se ha producido un error al registrar el administrador')
      }
    })
  }

  public actualizar() {

  }

  //Funciones para password
  showPassword() {
    if (this.inputType_1 == 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar() {
    if (this.inputType_2 == 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }
}
