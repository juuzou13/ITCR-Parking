import { Component, OnInit } from '@angular/core';
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
  dias_de_semana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  parqueos_registrados = [{_id: "1", _id_parqueo: "Parqueo principal #1"}, {_id: "2", _id_parqueo: "Parqueo subcontratado #1"}];
  placas_asociadas = [{_id: "1", codigo_placa: "ABC-123"}, {_id: "2", codigo_placa: "DEF-456"}];

  funcionario_estandar = localStorage.getItem("jefatura") == "0";

  newReserva: any = {
    rangoHorario: { dia: "", hora_entrada: "", hora_salida: "" }, 
    parqueo: "", 
    placa: "", 
    idPersona: "",
    idReserva: "", 
    idEspacio: "", 
    nombreVisitante: "", 
    nombreJefaturaAdmin: "",
    motivo: "", 
    sitio: "", 
    modelo: "", 
    color: ""
  }

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  cols : number = 0;

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

  ngAfterViewInit() {}

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
      
      this.newReserva.rangoHorario = {dia: this.dias_de_semana[form.controls['dia_semana'].value], hora_entrada: this.horaEntradaNewHorario, hora_salida: this.horaSalidaNewHorario};
      this.newReserva.parqueo = form.value.parqueo;
      this.newReserva.placa = form.value.placa;
      this.newReserva.idPersona = localStorage.getItem("id");

      //service con newReserva

      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'La reserva se ha registrado exitosamente.'
      })
      .afterClosed()
      .subscribe(() => {
        console.log(this.newReserva);
        form.resetForm();
        this.error_horario = false;
        this.error_horario_2 = false;
        this.tiempo_entrada = {hour: this.horas, minute: this.minutos};
        this.tiempo_salida = {hour: this.horas, minute: this.minutos};
      });
    }
  }

  onReservarJefatura(form: NgForm) {
    if(form.invalid) {
      return;
    }
    
    this.newReserva.rangoHorario = {dia: this.dias_de_semana[form.controls['dia_semana'].value], hora_entrada: "5:00", hora_salida: "23:59"};
      this.newReserva.parqueo = form.value.parqueo;
      this.newReserva.placa = form.value.placa;
      this.newReserva.idPersona = localStorage.getItem("id");

      //service con newReserva

      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'La reserva se ha registrado exitosamente.'
      })
      .afterClosed()
      .subscribe(() => {
        console.log(this.newReserva);
        form.resetForm();
        this.error_horario = false;
        this.error_horario_2 = false;
        this.tiempo_entrada = {hour: this.horas, minute: this.minutos};
        this.tiempo_salida = {hour: this.horas, minute: this.minutos};
      });

    form.resetForm();
    this.tiempo_entrada = {hour: this.horas, minute: this.minutos};
    this.tiempo_salida = {hour: this.horas, minute: this.minutos};
  }

}
