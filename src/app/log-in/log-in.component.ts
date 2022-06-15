import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from "../services/login.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})

export class LogInComponent implements OnInit {

  cols:number = 0;
  hide = true;
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  constructor(private breakpointObserver: BreakpointObserver, public router: Router, 
    private servicio_login: LoginService, public dialogo: MatDialog) {
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

  onIniciarSesion(form: NgForm){
    if (form.valid) {
      this.servicio_login.getCredentials(form)
        .subscribe({
          complete: () => { }, 
          error: (err: any) => { 
            this.dialogo
            .open(DialogoInfoComponent, {
              data: 'Error: '+ err.error
            });
          },
          next: (res: any) => { 
            console.log("resLogin", res);
            console.log("resLoginAdmin", res.admin);
            localStorage.setItem('admin', res.admin);
            localStorage.setItem('jefatura', res.jefatura);
            localStorage.setItem('operador', res.operador);
            localStorage.setItem('id', res.identificacion);
            localStorage.setItem('token', res.token);
            localStorage.setItem('nombre_completo', res.nombre_completo);
            if(res.jefatura){
              localStorage.setItem('campus_jefatura', res.campus_departamento_jefatura.campus);
              localStorage.setItem('dpto_jefatura', res.campus_departamento_jefatura.departamento);
            }
            if(res.admin) {
              this.router.navigate(['/menu-principal-admin']).then(() => {
                window.location.reload();
              });
            } else if(res.operador) {
              localStorage.setItem('idParqueoOperador', res.idParqueoOperador);
              this.router.navigate(['/menu-principal-operador']).then(() => {
                window.location.reload();
              });
            } else {
              this.router.navigate(['/menu-principal-func']).then(() => {
                window.location.reload();
            });
            }
          }
      });
    } else {
      return;
    }
  }
}
