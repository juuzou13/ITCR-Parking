import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { RegistrarParqueoService } from '../services/registrar-parqueo.service';

@Component({
  selector: 'app-reserva-espacio-funcionario',
  templateUrl: './reserva-espacio-funcionario.component.html',
  styleUrls: ['./reserva-espacio-funcionario.component.css']
})
export class ReservaEspacioFuncionarioComponent implements OnInit {

  horaEntradaNewHorario:string = "";
  horaSalidaNewHorario:string = "";

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
  horarioArray = [];
  dias_de_semana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  parqueos_registrados = [{_id: "1", _id_parqueo: "Parqueo principal #1"}, {_id: "2", _id_parqueo: "Parqueo subcontratado #1"}];
  placas_asociadas = [{_id: "1", codigo_placa: "ABC-123"}, {_id: "2", codigo_placa: "DEF-456"}];

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  cols : number = 0;

  displayedColumns: string[] = ['Dia','Entrada','Salida','Eliminar'];
  dataSource = new MatTableDataSource<any>(this.horarioArray);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  constructor(private breakpointObserver: BreakpointObserver, 
    config: NgbTimepickerConfig, public dialogo: MatDialog, private registrarParqueoService: RegistrarParqueoService) {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  ngOnInit(): void {
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

  onReservarEspacio(form: NgForm) {
    if(form.invalid || this.compararTiempos()!){
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
      
      this.dataSource.data.push({rangoHorario: {dia: this.dias_de_semana[form.controls['dia_semana'].value], hora_entrada: this.horaEntradaNewHorario, 
        hora_salida: this.horaSalidaNewHorario}, parqueo: form.value.parqueo, placa: form.value.placa, idPersona: localStorage.getItem("id"),
        idReserva: "", idEspacio: "", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "", sitio: "", modelo: "", color: ""});
      
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

  onConfirmarReserva(form: NgForm) {
    if(this.horarioArray.length == 0) {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: No se ha ingresado una reserva a la lista.'
      });
      return;
    }

    /* Recorrer este array y guardar en la base cada reserva de la lista. */
    console.log(this.horarioArray);
    
    this.dialogo
      .open(DialogoInfoComponent, {
        data: 'La reserva se ha registrado exitosamente.'
      })
      .afterClosed()
      .subscribe(() => {
        form.resetForm();
        this.horarioArray = [];
        this.updateDataSource();
        this.tiempo_entrada = {hour: this.horas, minute: this.minutos};
        this.tiempo_salida = {hour: this.horas, minute: this.minutos};
      });
  }

}
