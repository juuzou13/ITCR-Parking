import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { ConsultarParqueosService } from '../services/consultar-parqueos.service';
import { ReservarEspacioFuncionarioService } from '../services/reservar-espacio-funcionario.service';
import { Parqueo } from '../modelos/parqueo.model';

interface Dictionary<T> {
  [Key: string]: T;
}

export class SearchParameters {
  SearchFor: Dictionary<any> = {};
}

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

  lista_parqueos_ids: any = []
  lista_parqueos_reservas: any = new SearchParameters();
  lista_parqueos_objetos: any = []
  lista_index_eliminar: any = []

  tiempo_entrada = {hour: this.horas, minute: this.minutos};
  meridian = true;
  reservasActivas: any = [];
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
    private consultarParqueoService: ConsultarParqueosService,
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

  ngOnInit(): void {
    this.reservarEspacioService.findReservas().subscribe({
      next: (res: any) => {
        this.reservasActivas = res;
        for(var i = 0; i < this.reservasActivas.length; i++) {
          if(this.reservasActivas[i].idReserva == "OF") {
            continue;
          }
          var id_parqueo_reserva = this.reservasActivas[i].idParqueo;
          this.consultarParqueoService.findByID(id_parqueo_reserva).subscribe({
            next: (res: any) => {
              this.lista_parqueos_objetos.push(res);
            },
            error: (err: any) => {}
          });
        }
      },
    });
  }

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

    let fecha_reserva_entrada = new Date();
    let fecha_reserva_salida = new Date();

    for(var i = 0; i < this.lista_parqueos_objetos.length; i++) {
      if(this.lista_parqueos_reservas.SearchFor[this.lista_parqueos_objetos[i]._id] == null) {
        this.lista_parqueos_reservas.SearchFor[this.lista_parqueos_objetos[i]._id] = this.lista_parqueos_objetos[i];
      }
    }

    for(var i = 0; i < this.reservasActivas.length; i++) {
      let reserva_actual = this.reservasActivas[i];

      if(reserva_actual.idReserva != "FUNC") {
        continue;
      }

      fecha_reserva_entrada.setDate(this.reservasActivas[i].rangoHorario.dia_mes);
      fecha_reserva_entrada.setMonth(this.reservasActivas[i].rangoHorario.mes-1);
      fecha_reserva_entrada.setFullYear(this.reservasActivas[i].rangoHorario.anio);
      fecha_reserva_entrada.setHours(this.reservasActivas[i].rangoHorario.hora_entrada.split(":")[0]);
      fecha_reserva_entrada.setMinutes(this.reservasActivas[i].rangoHorario.hora_entrada.split(":")[1]);

      fecha_reserva_salida.setDate(this.reservasActivas[i].rangoHorario.dia_mes);
      fecha_reserva_salida.setMonth(this.reservasActivas[i].rangoHorario.mes-1);
      fecha_reserva_salida.setFullYear(this.reservasActivas[i].rangoHorario.anio);
      fecha_reserva_salida.setHours(this.reservasActivas[i].rangoHorario.hora_salida.split(":")[0]);
      fecha_reserva_salida.setMinutes(this.reservasActivas[i].rangoHorario.hora_salida.split(":")[1]);

      if(fecha_reserva_salida <= hora_ingresada) {
        if(this.lista_parqueos_reservas.SearchFor[reserva_actual.idParqueo] != null) {
          this.lista_parqueos_ids.push(reserva_actual.idParqueo);
          this.lista_parqueos_reservas.SearchFor[reserva_actual.idParqueo].espacios[reserva_actual.idEspacio].ocupado = "0";
        }
        this.reservarEspacioService.deleteReservaActiva(reserva_actual._id).subscribe({
          next: (res: any) => {
            console.log("Se eliminó la reserva de id "+reserva_actual._id);
          },
          error: (err: any) => {}
        });
        this.lista_index_eliminar.push(i);
      }
    }

    for(var i = 0; i < this.lista_parqueos_ids.length; i++) {
      this.consultarParqueoService.updateByID(this.lista_parqueos_reservas.SearchFor[this.lista_parqueos_ids[i]]).subscribe({
        next: (res: any) => {
          console.log("Se actualizó el parqueo de id: "+this.lista_parqueos_ids[i]);
        },
        error: (err: any) => {}
      });
    }

    console.log("Tamaño de lista reservas anterior "+this.reservasActivas.length);

    for(var i = 0; i < this.lista_index_eliminar.length; i++) {
      this.reservasActivas.splice(i, 1);
    }

    console.log("Nuevo tamaño de lista reservas "+this.reservasActivas.length);

    this.lista_parqueos_ids = [];

    for(var i = 0; i < this.reservasActivas.length; i++) {
      let reserva_actual = this.reservasActivas[i];

      if(reserva_actual.idReserva == "OF") {
        continue;
      }

      fecha_reserva_entrada.setDate(this.reservasActivas[i].rangoHorario.dia_mes);
      fecha_reserva_entrada.setMonth(this.reservasActivas[i].rangoHorario.mes-1);
      fecha_reserva_entrada.setFullYear(this.reservasActivas[i].rangoHorario.anio);
      fecha_reserva_entrada.setHours(this.reservasActivas[i].rangoHorario.hora_entrada.split(":")[0]);
      fecha_reserva_entrada.setMinutes(this.reservasActivas[i].rangoHorario.hora_entrada.split(":")[1]);

      fecha_reserva_salida.setDate(this.reservasActivas[i].rangoHorario.dia_mes);
      fecha_reserva_salida.setMonth(this.reservasActivas[i].rangoHorario.mes-1);
      fecha_reserva_salida.setFullYear(this.reservasActivas[i].rangoHorario.anio);
      fecha_reserva_salida.setHours(this.reservasActivas[i].rangoHorario.hora_salida.split(":")[0]);
      fecha_reserva_salida.setMinutes(this.reservasActivas[i].rangoHorario.hora_salida.split(":")[1]);

      if(fecha_reserva_entrada <= hora_ingresada && hora_ingresada <= fecha_reserva_salida) {
        if(this.lista_parqueos_reservas.SearchFor[reserva_actual.idParqueo] != null) {
          this.lista_parqueos_ids.push(reserva_actual.idParqueo);
          this.lista_parqueos_reservas.SearchFor[reserva_actual.idParqueo].espacios[reserva_actual.idEspacio].ocupado = "1";
        }
      }
    }

    for(var i = 0; i < this.lista_parqueos_ids.length; i++) {
      this.consultarParqueoService.updateByID(this.lista_parqueos_reservas.SearchFor[this.lista_parqueos_ids[i]]).subscribe({
        next: (res: any) => {
          console.log("Se actualizó el parqueo de id: "+this.lista_parqueos_ids[i]);
        },
        error: (err: any) => {}
      });
    }
  }
}