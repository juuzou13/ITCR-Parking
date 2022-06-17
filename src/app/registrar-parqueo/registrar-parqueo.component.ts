import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgForm, NgModel } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { PlatformLocation } from '@angular/common';
import {Campus} from '../modelos/campus.model';
import { RegistrarParqueoService } from '../services/registrar-parqueo.service';

@Component({
  selector: 'app-registrar-parqueo',
  templateUrl: './registrar-parqueo.component.html',
  styleUrls: ['./registrar-parqueo.component.css']
})
export class RegistrarParqueoComponent implements OnInit {

  horaEntradaNewHorario:String;
  horaSalidaNewHorario:String;

  seleccionado = false;
  subcontratado = false;
  fecha = new Date();
  horas = this.fecha.getHours();
  minutos = this.fecha.getMinutes();
  error_horario = false;
  error_horario_2 = false;
  periodo_minutos = 0;

  tiempo_entrada = {hour: this.horas, minute: this.minutos};
  tiempo_salida = {hour: this.horas, minute: this.minutos};
  meridian = true;
  tiempo_minimo = 40;
  dias_de_semana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  tipo_parqueo = ["Principal", "Subcontratado"];
  tipo_parqueo_seleccionado = "";
  espacios_parqueo = Array<any>();

  campusRegistrados:Array<Campus> = [
    {id: 1, nombre: "Cartago", direccion: ""},
    {id: 2, nombre: "San José", direccion: ""},
    {id: 3, nombre: "San Carlos", direccion: ""},
    {id: 4, nombre: "Alajuela", direccion: ""},
    {id: 5, nombre: "Limón", direccion: ""}
  ];

  horarioArray = [];

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  cols : number;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  newParqueo: any = {
    _id_parqueo: '',
    tipo: '',
    capacidad_total: 0,
    capacidad_actual: 0,
    horario: [],
    espacios: [],
    campus: '',
    espacios_jefatura: 0,
    espacios_VOficiales: 0,
    espacios_asignados: 0,
    espacios_visitantes: 0,
    espacios_NEspeciales: 0,
    direccion: '',
    contacto: '',
    id_contrato: ''
  }

  constructor(private breakpointObserver: BreakpointObserver, config: NgbTimepickerConfig, 
    public dialogo: MatDialog, private registrarParqueoService: RegistrarParqueoService) {
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
    config.spinners = false;
  }

  compararTiempos() {
    if(this.tiempo_entrada.hour > this.tiempo_salida.hour){
      this.error_horario = true;
      this.error_horario_2 = false;
    } else if (this.tiempo_entrada.hour == this.tiempo_salida.hour &&
      this.tiempo_entrada.minute > this.tiempo_salida.minute) {
        this.error_horario = true;
        this.error_horario_2 = false;
    } else if (this.tiempo_entrada.hour == this.tiempo_salida.hour &&
      this.tiempo_entrada.minute == this.tiempo_salida.minute) {
        this.error_horario = true;
        this.error_horario_2 = false;
    } else {
      this.periodo_minutos = (this.tiempo_salida.hour - this.tiempo_entrada.hour) * 60 +
        (this.tiempo_salida.minute - this.tiempo_entrada.minute);
      if(this.periodo_minutos < this.tiempo_minimo) {
        this.error_horario_2 = true;
        this.error_horario = false;
      } else {
        this.error_horario_2 = false;
        this.error_horario = false;
      }
    }
  }

  displayedColumns: string[] = ['Dia','Entrada','Salida','Eliminar'];
  dataSource = new MatTableDataSource<any>(this.horarioArray);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
  }

  onRegistrarParqueo(form: NgForm){
    const capacidad_adicional = form.value.espacios_jefatura + 
    form.value.espacios_vOficiales + form.value.espacios_visitantes +
    form.value.espacios_especiales;
    const asignados_tec = form.value.capacidad_total - capacidad_adicional;
    if(form.invalid){
        return;
    } else if(this.horarioArray.length == 0) {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: La lista de horarios está vacía'
      });
      return
    } else if(capacidad_adicional > form.value.capacidad_total) {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: La suma de espacios es mayor a la capacidad total'
      });
      return
    }
    
    this.newParqueo._id_parqueo = form.value.nombre;
    this.newParqueo.tipo = this.tipo_parqueo_seleccionado;
    this.newParqueo.capacidad_total = form.value.capacidad_total;
    this.newParqueo.capacidad_actual = form.value.capacidad_total;
    this.newParqueo.campus = form.value.campus.nombre;
    this.newParqueo.espacios_jefatura = form.value.espacios_jefatura;
    this.newParqueo.espacios_VOficiales = form.value.espacios_vOficiales;
    this.newParqueo.espacios_asignados = asignados_tec;
    this.newParqueo.espacios_visitantes = form.value.espacios_visitantes;
    this.newParqueo.espacios_NEspeciales = form.value.espacios_especiales;
    this.newParqueo.direccion = form.value.direccion;
    this.newParqueo.horario = this.horarioArray;

    if(this.tipo_parqueo_seleccionado == "Subcontratado") {
      this.newParqueo.contacto = form.value.contacto;
      this.newParqueo.id_contrato = form.value.id_contrato;
    } else {
      this.newParqueo.contacto = '';
      this.newParqueo.id_contrato = '';
    }

    for (let index = 0; index < asignados_tec; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "COMUN", ocupado: "0", departamentoFuncionario: ""});
    }
    for (let index = 0; index < form.value.espacios_especiales; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "ESPECIAL", ocupado: "0", departamentoFuncionario: ""});
    }
    for (let index = 0; index < form.value.espacios_jefatura; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "JEFATURA", ocupado: "0", departamentoFuncionario: ""});
    }
    for (let index = 0; index < form.value.espacios_vOficiales; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "OFICIAL", ocupado: "0", departamentoFuncionario: ""});
    }
    for (let index = 0; index < form.value.espacios_visitantes; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "VISITANTE", ocupado: "0", departamentoFuncionario: ""});
    }

    var indice = 0;
    for(let k in this.espacios_parqueo) { 
      this.espacios_parqueo[k]._id = `${indice}`;
      indice++;
    }

    this.newParqueo.espacios = this.espacios_parqueo;

    this.registrarParqueoService.addParqueo(this.newParqueo).subscribe({
      error: (err: any) => { 
        this.dialogo
        .open(DialogoInfoComponent, {
          data: 'Error: '+ err.error
        });
      },
      next: (res: any) => {
        this.dialogo
        .open(DialogoInfoComponent, {
          data: 'El parqueo se ha registrado exitosamente.'
        })
        .afterClosed()
        .subscribe(() => {
          form.resetForm();
          this.seleccionado = false;
          this.subcontratado = false;
          this.horarioArray = [];
          this.espacios_parqueo = [];
          this.updateDataSource();
        });
      }
    });
  }

  activarParqueoSub(parqueo: any) {
    this.tipo_parqueo_seleccionado = this.tipo_parqueo[parqueo-1];
    if(parqueo == 1) {
      this.seleccionado = true;
      this.subcontratado = false;
    } else if(parqueo == 2) {
      this.seleccionado = true;
      this.subcontratado = true;
    } else {
      this.seleccionado = false;
      this.subcontratado = false;
    }
  }

  registrarHorario(form: NgForm) {
    if(form.invalid || this.compararTiempos()){
      return;
    } else if (!this.error_horario && !this.error_horario_2) {

      if(form.controls['hora_entrada'].value.minute < 10){
        this.horaEntradaNewHorario = form.controls['hora_entrada'].value.hour + ':0' + form.controls['hora_entrada'].value.minute;
      } else{
        this.horaEntradaNewHorario = form.controls['hora_entrada'].value.hour + ':' + form.controls['hora_entrada'].value.minute;
      }

      if(form.controls['hora_salida'].value.minute < 10){
        this.horaSalidaNewHorario = form.controls['hora_salida'].value.hour + ':0' + form.controls['hora_salida'].value.minute;
      } else{
        this.horaSalidaNewHorario = form.controls['hora_salida'].value.hour + ':' + form.controls['hora_salida'].value.minute;
      }
      
      this.dataSource.data.push({dia: this.dias_de_semana[form.controls['dia_semana'].value], hora_entrada: this.horaEntradaNewHorario, hora_salida: this.horaSalidaNewHorario});

      this.refresh();
      form.resetForm();
      this.tiempo_entrada = {hour: this.horas, minute: this.minutos};
      this.tiempo_salida = {hour: this.horas, minute: this.minutos};
    }
  }
  refresh() {
    this.dataSource.data = this.dataSource.data;
  }

  onEliminarExtracto(index: number) {
    this.horarioArray.splice(index, 1);
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.horarioArray;
  }
}
