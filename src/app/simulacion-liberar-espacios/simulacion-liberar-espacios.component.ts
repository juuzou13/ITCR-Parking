import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { RegistrarParqueoService } from '../services/registrar-parqueo.service';
import { ReservarEspacioFuncionarioService } from '../services/reservar-espacio-funcionario.service';

@Component({
  selector: 'app-simulacion-liberar-espacios',
  templateUrl: './simulacion-liberar-espacios.component.html',
  styleUrls: ['./simulacion-liberar-espacios.component.css']
})
export class SimulacionLiberarEspaciosComponent implements OnInit {

  horaEntradaNewHorario:string = "";

  fechaS = new Date();
  minDate = new Date();
  fecha = new Date();
  horas = this.fecha.getHours();
  minutos = this.fecha.getMinutes();
  error_horario = false;
  error_horario_2 = false;
  periodo_minutos = 0;

  tiempo_entrada = {hour: this.horas, minute: this.minutos};
  meridian = true;
  dias_de_semana = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
  ];
  week_days = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
  ];
  months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

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
    config: NgbTimepickerConfig, public dialogo: MatDialog, 
    private registrarParqueoService: RegistrarParqueoService,
    private reservarEspacioService: ReservarEspacioFuncionarioService) {
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

  ngOnInit(): void {}

  onSimularDiaHora(form: NgForm) {
    if(form.invalid){
      return;
    }

    let hora_actual = new Date();
    let hora_ingresada = new Date();
    hora_ingresada.setDate(this.fechaS.getDate());
    hora_ingresada.setMonth(this.fechaS.getMonth());
    hora_ingresada.setFullYear(this.fechaS.getFullYear());
    hora_ingresada.setHours(form.controls['hora_entrada'].value.hour);
    hora_ingresada.setMinutes(form.controls['hora_entrada'].value.minute);

    if(hora_ingresada < hora_actual) {
      console.log("La hora ingresada es menor a la hora actual");
      return;
    }
    
    if(form.controls['hora_entrada'].value.minute < 10){
      this.horaEntradaNewHorario = form.controls['hora_entrada'].value.hour + ':0' + form.controls['hora_entrada'].value.minute;
    } else{
      this.horaEntradaNewHorario = form.controls['hora_entrada'].value.hour + ':' + form.controls['hora_entrada'].value.minute;
    }

    this.reservarEspacioService.findReservas().subscribe({
      next: (res: any) => {
        let fecha_reserva_entrada = new Date();
        let fecha_reserva_salida = new Date();
        for(var i = 0; i < res.length; i++) {
          fecha_reserva_entrada.setDate(res[i].rangoHorario.dia_mes);
          fecha_reserva_entrada.setMonth(res[i].rangoHorario.mes-1);
          fecha_reserva_entrada.setFullYear(res[i].rangoHorario.anio);
          fecha_reserva_entrada.setHours(res[i].rangoHorario.hora_entrada.split(":")[0]);
          fecha_reserva_entrada.setMinutes(res[i].rangoHorario.hora_entrada.split(":")[1]);

          fecha_reserva_salida.setDate(res[i].rangoHorario.dia_mes);
          fecha_reserva_salida.setMonth(res[i].rangoHorario.mes-1);
          fecha_reserva_salida.setFullYear(res[i].rangoHorario.anio);
          fecha_reserva_salida.setHours(res[i].rangoHorario.hora_salida.split(":")[0]);
          fecha_reserva_salida.setMinutes(res[i].rangoHorario.hora_salida.split(":")[1]);

          if(fecha_reserva_entrada <= hora_ingresada && hora_ingresada <= fecha_reserva_salida) {
            
            console.log("Debe setear el campo ocupado a 1");
          } else if(fecha_reserva_salida <= hora_ingresada) {
            console.log("Debe guardar reserva en colección de historial, eliminar la activa y setear el campo ocupado a 0.");
          }
        }
        
      },
    });

  }

}