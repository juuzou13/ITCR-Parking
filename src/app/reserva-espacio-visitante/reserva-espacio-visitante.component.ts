import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { ReservarEspacioFuncionarioService } from '../services/reservar-espacio-funcionario.service';

@Component({
  selector: 'app-reserva-espacio-visitante',
  templateUrl: './reserva-espacio-visitante.component.html',
  styleUrls: ['./reserva-espacio-visitante.component.css']
})
export class ReservaEspacioVisitanteComponent implements OnInit {

  horaEntradaNewHorario: string = '';
  horaSalidaNewHorario: string = '';

  fechaS = new Date();
  fecha = new Date();
  horas = this.fecha.getHours();
  minutos = this.fecha.getMinutes();
  minDate = new Date();

  error_horario = false;
  error_horario_2 = false;
  periodo_minutos = 0;

  tiempo_entrada = { hour: this.horas, minute: this.minutos };
  tiempo_salida = { hour: this.horas, minute: this.minutos };
  meridian = true;
  tiempo_minimo = 40;
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

  tipo_espacio_buscar = "";

  parqueos_registrados: Array<any> = [];
  placas_asociadas: Array<any> = [];
  funcionario_data: any = [];
  reservasActivas: any = [];

  newReserva: any;

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
    private reservarEspacioService: ReservarEspacioFuncionarioService
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

  ngAfterViewInit() {}

  ngOnInit(): void {
    let func_id: any = localStorage.getItem('id');
    if (func_id) {
      this.reservarEspacioService.getFuncionarioData(func_id).subscribe({
        next: (res: any) => {
          this.funcionario_data = res;
          
          this.tipo_espacio_buscar = "VISITANTE";
          this.placas_asociadas = res.placas_asociadas;
        },
      });
    }

    this.reservarEspacioService.getAllParqueos().subscribe({
      next: (res: any) => {
        console.log('res ', res);

        this.parqueos_registrados = res.filter((parqueo: any) => {
          return (parqueo.tipo=="Subcontratado" && (parseInt(parqueo.espacios_asignados) >= 1 || parseInt(parqueo.espacios_visitantes) >= 1)) || parseInt(parqueo.espacios_visitantes) >= 1;
        });
        
      },
    });

    this.reservarEspacioService.findReservas().subscribe({
      next: (res: any) => {
        this.reservasActivas = res;
      },
    });
  }

  compararTiempos() {
    if (this.tiempo_entrada.hour > this.tiempo_salida.hour) {
      this.error_horario = true;
      this.error_horario_2 = false;
    } else if (
      this.tiempo_entrada.hour == this.tiempo_salida.hour &&
      this.tiempo_entrada.minute > this.tiempo_salida.minute
    ) {
      this.error_horario = true;
      this.error_horario_2 = false;
    } else if (
      this.tiempo_entrada.hour == this.tiempo_salida.hour &&
      this.tiempo_entrada.minute == this.tiempo_salida.minute
    ) {
      this.error_horario = true;
      this.error_horario_2 = false;
    } else {
      this.periodo_minutos =
        (this.tiempo_salida.hour - this.tiempo_entrada.hour) * 60 +
        (this.tiempo_salida.minute - this.tiempo_entrada.minute);
      if (this.periodo_minutos < this.tiempo_minimo) {
        this.error_horario_2 = true;
        this.error_horario = false;
      } else {
        this.error_horario_2 = false;
        this.error_horario = false;
      }
    }
  }


  onReservarEspacio(form: NgForm) {
    this.compararTiempos();
    if(form.invalid) {
      return;
    }
    if (!this.error_horario && !this.error_horario_2) {

      let hora_actual = new Date();
      let hora_ingresada = new Date();
      hora_ingresada.setDate(this.fechaS.getDate());
      hora_ingresada.setMonth(this.fechaS.getMonth());
      hora_ingresada.setFullYear(this.fechaS.getFullYear());
      hora_ingresada.setHours(form.controls['hora_entrada'].value.hour);
      hora_ingresada.setMinutes(form.controls['hora_entrada'].value.minute);

      if(hora_ingresada < hora_actual) {
        this.dialogo
        .open(DialogoInfoComponent, {
          data: 'Error: La hora ingresada es menor a la hora actual.'
        });
        return;
      }

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

      if (form.controls['hora_salida'].value.minute < 10) {
        this.horaSalidaNewHorario =
          form.controls['hora_salida'].value.hour +
          ':0' +
          form.controls['hora_salida'].value.minute;
      } else {
        this.horaSalidaNewHorario =
          form.controls['hora_salida'].value.hour +
          ':' +
          form.controls['hora_salida'].value.minute;
      }
      
      this.newReserva = {
        idReserva: 'VIS',
        idPersona: form.value.identificacion,
        idEspacio: 'N/A',
        idParqueo: form.value.parqueo,
        placa: form.value.placa,
        rangoHorario: {
          dia: this.week_days[this.fechaS.getDay()],
          dia_mes: this.fechaS.getDate().toString(),
          mes: (this.fechaS.getMonth() + 1).toString(),
          anio: this.fechaS.getFullYear().toString(),
          hora_entrada: this.horaEntradaNewHorario,
          hora_salida: this.horaSalidaNewHorario,
        },
        nombreVisitante: form.value.nombre,
        nombreJefaturaAdmin: localStorage.getItem('nombre_completo'),
        motivo: form.value.motivo,
        sitio: form.value.sitio,
        modelo: form.value.modelo,
        color: form.value.color,
      };
    }

    this.onConfirmarReserva(form);
  }

  ocuparCampo(listaEspacios: Array<any>, parqueoReservado: any, idDeEspacioAOcupar: any): any {
    // idParqueo = parqueoReservado[0].espacios

    let espaciosDeParqueoNoOcupables = listaEspacios.filter((espacio: any) => {
      return !(espacio.tipo == this.tipo_espacio_buscar && espacio.ocupado == 0);
    })

    let espaciosDeParqueoOcupables = listaEspacios.filter((espacio: any) => {
      return espacio.tipo == this.tipo_espacio_buscar && espacio.ocupado == 0;
    })

    console.log("espaciosDeParqueo: ", espaciosDeParqueoOcupables);

    if (espaciosDeParqueoOcupables.length > 0) {

      let result = espaciosDeParqueoOcupables[0];
      let newSpaces: Array<any>;

      espaciosDeParqueoOcupables[0].ocupado = '1';

      newSpaces = espaciosDeParqueoNoOcupables.concat(espaciosDeParqueoOcupables);

      parqueoReservado.espacios = newSpaces;

      console.log(parqueoReservado.espacios)

      return result;
    } else {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: No hay espacios disponibles en este parqueo.'
      });
    }
  }

  onConfirmarReserva(form: NgForm) {
    console.log("Data func: ", this.tipo_espacio_buscar);

    let currentReservation: any = {};

    let parqueoReservado: any = {};

    let reservasActivasEnRango: Array<any> = [];

    let espaciosDeParqueo: Array<any> = [];

    let horariosDeParqueo: any = [];
    let horariosDeParqueoEnRango: Array<any> = [];

    let horariosDeFuncEnDiaDeSemana: Array<any> = [];
    let horariosDeFuncEnRango: Array<any> = [];

    let reservationDateStart: Date;
    let reservationDateEnd: Date;

    let temporalDateStart: Date;
    let temporalDateEnd: Date;

    let currentReservationes_fallidas: Array<any> = [];

      currentReservation = this.newReserva;

      reservationDateStart = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, currentReservation.rangoHorario.hora_entrada.split(':')[0], currentReservation.rangoHorario.hora_entrada.split(':')[1]);
      reservationDateEnd = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, currentReservation.rangoHorario.hora_salida.split(':')[0], currentReservation.rangoHorario.hora_salida.split(':')[1]);

      //Datos de parqueo y horarios de parqueo

      parqueoReservado = this.parqueos_registrados.filter((parqueo) => {
        return parqueo._id === currentReservation.idParqueo;
      });

      console.log("Parqueo reservado: ", parqueoReservado);

      horariosDeParqueo = parqueoReservado[0].horario.filter((horario: any) => {
        return horario.dia === currentReservation.rangoHorario.dia;
      });

      console.log("Horarios parqueo: ", horariosDeParqueo);

      console.log("Horarios func", this.funcionario_data.horario)

      horariosDeFuncEnDiaDeSemana = this.funcionario_data.horario.filter((horario: any) => {
        return horario.dia === currentReservation.rangoHorario.dia;
      });

      for (let index = 0; index < horariosDeFuncEnDiaDeSemana.length; index++) {
        const element = horariosDeFuncEnDiaDeSemana[index];
        console.log("Horario funcionario en dia semana: ", element);
        
      }

      if (horariosDeParqueo.length > 0) {

        horariosDeParqueoEnRango = horariosDeParqueo.filter((horario: any) => {
          temporalDateStart = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, horario.hora_entrada.split(':')[0], horario.hora_entrada.split(':')[1]);
          temporalDateEnd = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, horario.hora_salida.split(':')[0], horario.hora_salida.split(':')[1]);


          return (temporalDateStart <= reservationDateStart && reservationDateEnd <= temporalDateEnd);
        }
        )

        console.log("Horarios que permiten reservacion:")
        console.log(horariosDeParqueoEnRango)

        if (horariosDeParqueoEnRango.length > 0) {
  
            console.log("Res activas")
            console.log(this.reservasActivas);

            let reservasEnMismoDiayMismoParqueo = this.reservasActivas.filter((reserva: any) => {
              return (currentReservation.idParqueo == reserva.idParqueo && reserva.rangoHorario.dia_mes == currentReservation.rangoHorario.dia_mes && reserva.rangoHorario.mes == currentReservation.rangoHorario.mes && reserva.rangoHorario.anio == currentReservation.rangoHorario.anio);
            })

            

            console.log("Res mismo dia y parqueo")
            console.log(reservasEnMismoDiayMismoParqueo)

            reservasActivasEnRango = reservasEnMismoDiayMismoParqueo.filter((reserva: any) => {

              temporalDateStart = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, reserva.rangoHorario.hora_entrada.split(':')[0], reserva.rangoHorario.hora_entrada.split(':')[1]);
              temporalDateEnd = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, reserva.rangoHorario.hora_salida.split(':')[0], reserva.rangoHorario.hora_salida.split(':')[1]);
              return !(reservationDateEnd <= temporalDateStart || temporalDateEnd <= reservationDateStart);

            });

            console.log("Res mismo dia y parqueo y rango")

            console.log(reservasActivasEnRango);

            let espaciosOcupadosPorAlgunaResEnRango: Array<any> = [];

            for (let index = 0; index < reservasActivasEnRango.length; index++) {

              const espacio = reservasActivasEnRango[index].idEspacio;
              espaciosOcupadosPorAlgunaResEnRango.push(espacio);

            }

            console.log("Espacios ocupados por alguna res en rango", espaciosOcupadosPorAlgunaResEnRango)

            

            let listaEspacios;

            console.log("Tipo", parqueoReservado[0].tipo)
            

            if(parqueoReservado[0].tipo == "Subcontratado"){
              listaEspacios = parqueoReservado[0].espacios.filter((espacio: any) => {
                return espacio.tipo == "VISITANTE" && !espaciosOcupadosPorAlgunaResEnRango.includes(espacio._id);
              })
              console.log("Lista of espacios: ", listaEspacios);
              if(listaEspacios.length == 0){
                listaEspacios = parqueoReservado[0].espacios.filter((espacio: any) => {
                  return espacio.tipo == "COMUN" && !espaciosOcupadosPorAlgunaResEnRango.includes(espacio._id);;
                })
              }
              
              
            }else{
              listaEspacios = parqueoReservado[0].espacios.filter((espacio: any) => {
                return espacio.tipo == "VISITANTE" && !espaciosOcupadosPorAlgunaResEnRango.includes(espacio._id);;
              })
            }
            console.log(listaEspacios)

            if (reservasActivasEnRango.length > 0) {

              let espaciosDeParqueoOcupables = listaEspacios

              if (espaciosDeParqueoOcupables.length != 0) {
                currentReservation.rangoHorario.dia_mes = parseInt(currentReservation.rangoHorario.dia_mes);
                currentReservation.rangoHorario.mes = parseInt(currentReservation.rangoHorario.mes);
                currentReservation.rangoHorario.anio = parseInt(currentReservation.rangoHorario.anio);

                let espacioAsignado = espaciosDeParqueoOcupables[0]._id;

                currentReservation.idEspacio = espacioAsignado;
                console.log(espacioAsignado);
                console.log("Current res: ", currentReservation)
                
                this.reservarEspacioService.registrarReserva(currentReservation).subscribe();
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
                  location.reload();
                });
              } else {
                this.dialogo
                .open(DialogoInfoComponent, {
                  data: 'Error: No hay espacios disponibles en este parqueo.'
                });
              }

            } else {

              currentReservation.rangoHorario.dia_mes = parseInt(currentReservation.rangoHorario.dia_mes);
              currentReservation.rangoHorario.mes = parseInt(currentReservation.rangoHorario.mes);
              currentReservation.rangoHorario.anio = parseInt(currentReservation.rangoHorario.anio);

              let espacioAsignado = listaEspacios[0]._id;

              currentReservation.idEspacio = espacioAsignado;
              this.reservarEspacioService.registrarReserva(currentReservation).subscribe();
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
                location.reload();
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
            "Los horarios disponibles para el día "+this.newReserva.rangoHorario.dia+" son: \n"+horarios_dia
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
          data: 'Error: No hay horarios de parqueo registrados para el día '+this.newReserva.rangoHorario.dia+'.'
        });
      }
      this.ngOnInit();
  }
}