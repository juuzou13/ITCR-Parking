import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';

@Component({
  selector: 'app-registrar-operador',
  templateUrl: './registrar-operador.component.html',
  styleUrls: ['./registrar-operador.component.css']
})
export class RegistrarOperadorComponent implements OnInit {

  cols : number = 0;
  hide = true;

  newOperador: any = {
    identificacion: '',
    nombre_completo: '',
    contrasenna: '',
    celular: '',
    correo: '',
    estacionamiento_a_cargo: '',
  };
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  parqueos_registrados: any = [
    {_id_parqueo:'OASIS'},
    {_id_parqueo:'TEC Principal'}
  ];
  constructor(private breakpointObserver: BreakpointObserver, public router: Router,
    public dialogo: MatDialog) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      }
    });
  }


  ngOnInit(): void {
  }

  onRegistrarOperador(form:NgForm){
    if(form.invalid){
      return;
    }
  }

}
