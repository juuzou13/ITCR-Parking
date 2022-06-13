import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { ConsultarParqueosService } from '../services/consultar-parqueos.service';
import { RegistroFuncionarioService } from '../services/registro-funcionario.service';

@Component({
  selector: 'app-registrar-operador',
  templateUrl: './registrar-operador.component.html',
  styleUrls: ['./registrar-operador.component.css']
})
export class RegistrarOperadorComponent implements OnInit {

  cols : number = 0;
  hide = true;

  parqueoSeleccionado : any = [];

  newOperador: any = {
    identificacion: '',
    nombre_completo: '',
    contrasenna: '',
    celular: '',
    horario: [],
    correo_institucional: '',
    departamentos: [{ campus: '', departamento: '' }],
    tipo_funcionario: '',
    placas_asociadas: [],
    admin: 0,
    jefatura: 0,
    correo_personal: '',
    campus_departamento_jefatura: { campus: '', departamento: '' },
    incapacitado: 0,
    idParqueoOperador: "",
  };

  newOperador2: any = {
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
    private servicio_parqueos: ConsultarParqueosService,
    private servicioRegistrarFuncionario: RegistroFuncionarioService, public dialogo: MatDialog) {
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
    this.servicio_parqueos.getAllComboBox().subscribe({
      complete: () => {},
      error: (err: any) => { 
       this.dialogo
       .open(DialogoInfoComponent, {
         data: 'Error: '+ err.error
       });
     },
     next: (res: any) => {
       console.log("res", res);
       this.parqueos_registrados = res;
     }
    })
  }

  onRegistrarOperador(form:NgForm){
    if(form.invalid){
      return;
    }

    this.servicioRegistrarFuncionario
      .getFuncionarioById(form.value.identificacion)
      .subscribe({
        complete: () => {},
        next: (res: any) => {
          if(res !== null){
            this.dialogo
            .open(DialogoInfoComponent, {
              data: 'Error: La identificación ingresada ya ha sido utilizada.'
            })
            .afterClosed()
            .subscribe(() => {
            });
          }
          else{
            this.servicioRegistrarFuncionario.getFuncionarioByCorreo(form.value.correoInstitucional)
            .subscribe({
              next: (res2: any) => { 
                if(res2 !== null){
                  console.log("True correo");
                  this.dialogo
                  .open(DialogoInfoComponent, {
                    data: 'Error: El correo ingresado ya ha sido utilizado.'
                  })
                  .afterClosed()
                  .subscribe(() => {
                  });
                }else{
                  this.newOperador.nombre_completo = form.value.nombre;
                  this.newOperador.contrasenna = form.value.contrasenia;
                  this.newOperador.identificacion = form.value.identificacion;
                  this.newOperador.celular = form.value.numeroTelefono;
                  this.newOperador.correo_institucional = form.value.correoInstitucional;
                  this.newOperador.tipo_funcionario = "Operador";
                  this.newOperador.idParqueoOperador = this.parqueoSeleccionado._id;
                  
                  this.servicioRegistrarFuncionario
                    .registrarFuncionario(this.newOperador)
                    .subscribe({
                      complete: () => {},
                      next: (res: any) => {
                        this.dialogo
                        .open(DialogoInfoComponent, {
                          data: 'El operador se ha registrado exitosamente.'
                        })
                        .afterClosed()
                        .subscribe(() => {
                          form.resetForm();
                          this.router.navigate(['/menu-principal-admin']);
                        });
                      },
                    });
                }
              }
            });
          }
        }
    });
  }

}
