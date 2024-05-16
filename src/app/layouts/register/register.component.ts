import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-register-layout',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Input() tipo = "";
  @Input() title = "";
}
