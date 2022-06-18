import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { ReservarEspacioFuncionarioService } from '../services/reservar-espacio-funcionario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-espacio-voficial',
  templateUrl: './reserva-espacio-voficial.component.html',
  styleUrls: ['./reserva-espacio-voficial.component.css']
})
export class ReservaEspacioVoficialComponent implements OnInit {

  fechaS = new Date();
  fecha = new Date();
  horas = this.fecha.getHours();
  minutos = this.fecha.getMinutes();
  minDate = new Date();

  error_horario = false;
  error_horario_2 = false;
  periodo_minutos = 0;

  idParqueo = localStorage.getItem('idParqueoOperador');

  tiempo_entrada = { hour: this.horas, minute: this.minutos };
  tiempo_salida = { hour: this.horas, minute: this.minutos };
  meridian = true;

  parqueoReservado:any;

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

  parqueos_registrados: Array<any> = [];
  horaEntradaNewHorario:string = '';

  estadiaVehiculoOficial: any;

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  cols: number = 0;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1,
  };

  constructor(
    private breakpointObserver: BreakpointObserver,
    config: NgbTimepickerConfig,
    public dialogo: MatDialog,
    private reservarEspacioService: ReservarEspacioFuncionarioService,
    public router: Router
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
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

  ngAfterViewInit() { }

  ngOnInit(): void {
    let func_id: any = localStorage.getItem('id');
   
    this.reservarEspacioService.getParqueo(this.idParqueo).subscribe({
      next: (res: any) => {
        console.log('res ', res);

        this.parqueoReservado = res;
      },
    });

  }

  onReservarEspacio(form: NgForm) {
    
    if (form.invalid) {
      return;
    }

    console.log("Parqueo reservado "+this.parqueoReservado)

    if (form.controls['hora_entrada'].value.minute < 10) {
      this.horaEntradaNewHorario =
        form.controls['hora_entrada'].value.hour +
        ':0' +
        form.controls['hora_entrada'].value.minute;
    } else {
      this.horaEntradaNewHorario =
        form.controls['hora_entrada'].value.hour +
        ':' +
        form.controls['hora_entrada'].value.minute;
    }
    let now: Date = new Date();

    this.estadiaVehiculoOficial = {
      idReserva: "OF",
      idPersona: form.value.identificacion,
      idEspacio: "",
      idParqueo: this.idParqueo,
      placa: form.value.placa,
      rangoHorario: {
        dia: this.week_days[now.getDay()],
        dia_mes: now.getDate().toString(),
        mes: (now.getMonth() + 1).toString(),
        anio: now.getFullYear().toString(),
        hora_entrada: this.horaEntradaNewHorario,
        hora_salida: "",
      },
      nombreVisitante: "",
      nombreJefaturaAdmin: "",
      motivo: "",
      sitio: "",
      modelo: form.value.modelo,
      color: form.value.color,
    };

    this.onConfirmarReserva(form);
  }

  ocuparCampo(espacioAOcupar: number, parqueoReservado: any): void {

    let parking_spaces: Array<any> = parqueoReservado.espacios;

    for(let i = 0; i < parking_spaces.length; i++){
      if(parking_spaces[i]._id == espacioAOcupar){
        parking_spaces[i].ocupado = "1";
        break;
      }
    }
    
    parqueoReservado.espacios = parking_spaces;

    //console.log("Parqueo reservado: ", parqueoReservado);

    
    this.reservarEspacioService.ocuparCampo(parqueoReservado).subscribe({
      next: (res: any) => {
        console.log('res ', res);
      },
      error: (err: any) => {
        console.log("Something went wrong", err);
      }
    });

  }

  onConfirmarReserva(form: NgForm) {

    let currentEstadiaVehiculoOficial: any = {};

    let horariosDeParqueo: Array<any> = [];
    let horariosDeParqueoEnRango: Array<any> = [];

    let now: Date = new Date();

    currentEstadiaVehiculoOficial = this.estadiaVehiculoOficial;
    
    console.log("Parqueo reservado: ", this.parqueoReservado);

    horariosDeParqueo = this.parqueoReservado.horario.filter((horario: any) => {
      return horario.dia === this.week_days[now.getDay()];
    });

    console.log("Horarios de parqueo: ", horariosDeParqueo);

    if (horariosDeParqueo.length > 0) {  

      horariosDeParqueoEnRango = horariosDeParqueo.filter((horario: any) => {
        let temporalDateStart: Date = new Date;
        temporalDateStart.setHours(horario.hora_entrada.split(':')[0]);
        temporalDateStart.setMinutes(horario.hora_entrada.split(':')[1]);
        let temporalDateEnd = new Date;
        temporalDateEnd.setHours(horario.hora_salida.split(':')[0]);
        temporalDateEnd.setMinutes(horario.hora_salida.split(':')[1]);

        return (temporalDateStart <= now && now <= temporalDateEnd);
      }
      );

      console.log("Horarios de parqueo en rango: ", horariosDeParqueoEnRango);

      if (horariosDeParqueoEnRango.length > 0) {

        let espaciosDeParqueoOcupables = this.parqueoReservado.espacios.filter((espacio: any) => {
          return espacio.tipo == "OFICIAL" && espacio.ocupado==0;
        })

        if (espaciosDeParqueoOcupables.length > 0) {

          let espacioAsignado = espaciosDeParqueoOcupables[0]._id;
          
          this.ocuparCampo(espacioAsignado, this.parqueoReservado);

          currentEstadiaVehiculoOficial.idEspacio = espacioAsignado;

          console.log(espacioAsignado);

          this.reservarEspacioService.registrarReserva(currentEstadiaVehiculoOficial).subscribe({
            next: (res: any) => {
              console.log('res ', res);
            },
            error: (err: any) => {
              console.log("Error: ", err);
            }
          });
          console.log("Estadia vehiculo oficial: ", currentEstadiaVehiculoOficial);
          this.dialogo
          .open(DialogoInfoComponent, {
            data: 'La reserva se ha registrado exitosamente.'
          })
          .afterClosed()
          .subscribe(() => {
            form.resetForm();
            this.error_horario = false;
            this.error_horario_2 = false;
            this.tiempo_entrada = { hour: this.horas, minute: this.minutos };
            this.tiempo_salida = { hour: this.horas, minute: this.minutos };
            location.reload();
          });
        } else {
          this.dialogo
          .open(DialogoInfoComponent, {
            data: 'Error: No hay espacios disponibles para vehículos oficiales.'
          })
          .afterClosed()
          .subscribe(() => {
            form.resetForm();
            this.router.navigate(['/menu-principal-operador']);
          });
        }

      } else {
        var mensaje_error = ""
          var horarios_dia = "|"
          if(horariosDeParqueo.length != 0) {
            for(var i = 0; i < horariosDeParqueo.length; i++) {
              horarios_dia += horariosDeParqueo[i].hora_entrada+" - "+horariosDeParqueo[i].hora_salida+"|"
            }
            mensaje_error = "Error: No hay horarios en el parqueo que admitan esta reserva. \n"+
            "Los horarios disponibles para el día "+this.estadiaVehiculoOficial.rangoHorario.dia+" son: \n"+horarios_dia
          } else {
            mensaje_error = "Error: No hay horarios en el parqueo que admitan esta reserva."
          }
          
          this.dialogo
          .open(DialogoInfoComponent, {
            data: mensaje_error
          });
      }

    } else {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: No hay horarios de parqueo registrados para el día '+this.estadiaVehiculoOficial.rangoHorario.dia+'.'
      });
    }
  }
}