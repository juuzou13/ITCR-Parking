import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { RegistroFuncionarioService } from '../services/registro-funcionario.service';

@Component({
  selector: 'app-registrar-funcionario',
  templateUrl: './registrar-funcionario.component.html',
  styleUrls: ['./registrar-funcionario.component.css']
})
export class RegistrarFuncionarioComponent implements OnInit, AfterViewInit {

  cols : number;
  jefaturaActivada = false;
  hide = true;

  by_id = false;
  by_correo = false;

  departamentos_registrados: any = [];

  newFuncionario: any = {
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


  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }
  tempSede:string;
  tempDpto:string;

  departamentos = [];

  displayedColumns: string[] = ['Departamento', 'Campus','delete'];
  dataSource = new MatTableDataSource<any>(this.departamentos);
  
  constructor(private breakpointObserver: BreakpointObserver, public router: Router,
    public dialogo: MatDialog, private servicioRegistrarFuncionario: RegistroFuncionarioService) {
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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(){
    this.refresh();

    this.servicioRegistrarFuncionario.getDepartamentos()
    .subscribe({
      complete: () => {},
      next: (res: any) => {
          this.departamentos_registrados = res;
    }});
  }   

  onRegistrarFuncionario(form: NgForm){
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
                  this.newFuncionario.nombre_completo = form.value.nombre;
                  this.newFuncionario.contrasenna = form.value.contrasenia;
                  this.newFuncionario.identificacion = form.value.identificacion;
                  this.newFuncionario.celular = form.value.numeroTelefono;
                  this.newFuncionario.correo_institucional = form.value.correoInstitucional;
                  this.newFuncionario.tipo_funcionario = form.value.tipoF;
                
                  this.newFuncionario.admin = form.value.tipoF=="Docente"? 0: 1;
                  this.newFuncionario.departamentos = this.dataSource.data;

                  this.newFuncionario.incapacitado = form.value.incapacitado=="0"? 0: 1;;
                  this.newFuncionario.jefatura = form.value.jefatura=="0"? 0: 1;

                  if(this.newFuncionario.jefatura == 1){
                    let object = {campus: form.value.dpto.nombre_campus, departamento: form.value.dpto.departamento};
                    this.newFuncionario.campus_departamento_jefatura = object;
                  }
                  
                  this.servicioRegistrarFuncionario
                    .registrarFuncionario(this.newFuncionario)
                    .subscribe({
                      complete: () => {},
                      next: (res: any) => {
                        this.dialogo
                        .open(DialogoInfoComponent, {
                          data: 'El funcionario se ha registrado exitosamente.'
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

  onRegistrarDepartamento(form: NgForm, campus:any){
    if(form.valid){      
      let encontrado = false;
      let object = {campus: form.control.value.dpto.nombre_campus,
      departamento: form.control.value.dpto.departamento};
      for(let k in this.dataSource.data) {
        if(this.dataSource.data[k].campus === object.campus &&
          this.dataSource.data[k].departamento === object.departamento){
            encontrado = true;
        }
      }
      if(!encontrado){
        this.dataSource.data.push(object);
        this.refresh();
      }
    }
  }

  refresh() {
    this.dataSource.data = this.dataSource.data;
  }

  removeDpto(index:number){
    this.departamentos.splice(index, 1);
    this.refresh();
  }

  activarJefatura(num: number){
    if(num == 1) {
      this.jefaturaActivada = true;
    }
    else{
      this.jefaturaActivada = false;
    }
  }
}
