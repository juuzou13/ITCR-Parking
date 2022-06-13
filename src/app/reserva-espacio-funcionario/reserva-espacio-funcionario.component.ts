import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { ReservarEspacioFuncionarioService } from '../services/reservar-espacio-funcionario.service';

@Component({
  selector: 'app-reserva-espacio-funcionario',
  templateUrl: './reserva-espacio-funcionario.component.html',
  styleUrls: ['./reserva-espacio-funcionario.component.css'],
})
export class ReservaEspacioFuncionarioComponent implements OnInit {
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
  horarioArray = [];
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

  

  parqueos_registrados: Array<any> = [];
  placas_asociadas: Array<any> = [];
  funcionario_data: any = [];

  funcionario_estandar = localStorage.getItem('jefatura') == '0';

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  cols: number = 0;

  displayedColumns: string[] = ['Dia', 'Entrada', 'Salida', 'Eliminar'];
  dataSource = new MatTableDataSource<any>(this.horarioArray);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
  }

  ngOnInit(): void {
    console.log('Init');
    this.reservarEspacioService.getAllParqueos().subscribe({
      next: (res: any) => {
        console.log('res ', res);
        this.parqueos_registrados = res;
      },
    });
    let func_id: any = localStorage.getItem('id');
    if (func_id) {
      this.reservarEspacioService.getFuncionarioData(func_id).subscribe({
        next: (res: any) => {
          console.log(func_id);
          console.log('res ', res);
          this.funcionario_data = res;
          this.placas_asociadas = res.placas_asociadas;
        },
      });
    }
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
    if (form.invalid || this.compararTiempos()!) {
      return;
    } else if (!this.error_horario && !this.error_horario_2) {
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

      this.dataSource.data.push({
        idReserva: 'X',
        idPersona: localStorage.getItem('id'),
        idEspacio: 'Espacio X',
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
        nombreVisitante: '',
        nombreJefaturaAdmin: '',
        motivo: '',
        sitio: '',
        modelo: '',
        color: '',
      });

      console.log(this.dataSource.data);
      this.refresh();
      form.resetForm();
      this.tiempo_entrada = { hour: this.horas, minute: this.minutos };
      this.tiempo_salida = { hour: this.horas, minute: this.minutos };
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
    if (this.horarioArray.length == 0) {
      this.dialogo.open(DialogoInfoComponent, {
        data: 'Error: No se ha agregado una reserva a la lista.',
      });
      return;
    }

    let currentReservation: any = {};
    
    let parqueoReservado: any = {};
    let horariosDeParqueo: Array<any> = [];
    let horariosDeParqueoEnRango: Array<any> = [];

    let horariosDeFuncEnDiaDeSemana: Array<any> = [];
    
    

    let hora_entrada_currentReservation: number;
    let minuto_entrada_currentReservation: number;
    let hora_salida_currentReservation: number;
    let minuto_salida_currentReservation: number;

    let hora_entrada_parqueo: number;
    let minuto_entrada_parqueo: number;
    let hora_salida_parqueo: number;
    let minuto_salida_parqueo: number;

    let reservationDateStart: Date;
    let reservationDateEnd: Date;

    let temporalDateStart: Date;
    let temporalDateEnd: Date;

    let testDate2: Date;

    let currentReservationes_fallidas: Array<any> = [];

    for (let i = 0; i < this.dataSource.data.length; i++) {

      currentReservation = this.dataSource.data[i];

      reservationDateStart = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, currentReservation.rangoHorario.hora_entrada.split(':')[0], currentReservation.rangoHorario.hora_entrada.split(':')[1]);
      reservationDateEnd = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, currentReservation.rangoHorario.hora_salida.split(':')[0], currentReservation.rangoHorario.hora_salida.split(':')[1]);
      
      //Datos de parqueo y horarios de parqueo

      parqueoReservado = this.parqueos_registrados.filter((parqueo) => {
        return parqueo._id === currentReservation.idParqueo;
      });
      console.log(parqueoReservado);
      horariosDeParqueo = parqueoReservado[0].horario.filter((horario: any) => {
        return horario.dia === currentReservation.rangoHorario.dia;
      });

      console.log(currentReservation);
      console.log(parqueoReservado);
      console.log(horariosDeParqueo);
      console.log(horariosDeParqueoEnRango);

      console.log(reservationDateStart);
      console.log(reservationDateEnd);

      
      if(horariosDeParqueo.length > 0){

        horariosDeParqueoEnRango = horariosDeParqueo.filter((horario: any) => {
          temporalDateStart = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, horario.hora_entrada.split(':')[0], horario.hora_entrada.split(':')[1]);
          temporalDateEnd = new Date(currentReservation.rangoHorario.anio, currentReservation.rangoHorario.mes - 1, currentReservation.rangoHorario.dia_mes, horario.hora_salida.split(':')[0], horario.hora_salida.split(':')[1]);
          
          
          return (temporalDateStart <= reservationDateStart && reservationDateEnd <= temporalDateEnd);
        }
        )

        console.log("Horarios que permiten reservacion:")
        console.log(horariosDeParqueoEnRango)

        if(horariosDeParqueoEnRango.length > 0){
          
        }else{
          console.log("No hay horarios en este parqueo que admitan esta reserva");
        }
      }else{
        console.log("No hay horarios de parqueo para el dia de la semana");
      }

      //return (reservationDateEnd < temporalDateStart) || (temporalDateEnd < reservationDateStart);
      

    /*

      //Tod.os los horarios de un funcionario en un dia de la semana especifico
      horariosDeFuncEnDiaDeSemana = this.funcionario_data.horario.filter((horario: any) => {
        return horario.dia === currentReservation.rangoHorario.dia;
      });


      


      hora_entrada_parqueo = parseInt(horariosDeParqueo[0].hora_entrada.split(':')[0]);
      minuto_entrada_parqueo = parseInt(horariosDeParqueo[0].hora_entrada.split(':')[1]);

      hora_salida_parqueo = parseInt(horariosDeParqueo[0].hora_salida.split(':')[0]);
      minuto_salida_parqueo = parseInt(horariosDeParqueo[0].hora_salida.split(':')[1]);

      //Validaciones

      

      if(horariosDeFuncEnDiaDeSemana.length == 0){
        console.log("No hay horarios de funcionario para el dia de la semana");
      }



      for(let j = 0; j < horariosDeFuncEnDiaDeSemana.length; j++) {
        if(hora_entrada_currentReservation >= hora_entrada_parqueo && hora_entrada_currentReservation <= hora_salida_parqueo) {
          if(minuto_entrada_currentReservation >= minuto_entrada_parqueo && minuto_entrada_currentReservation <= minuto_salida_parqueo) {
            currentReservationes_fallidas.push(currentReservation);
          }
        }
      }


      console.log("Parameters for validations: ", currentReservation, parqueoReservado, horariosDeFuncEnDiaDeSemana);
          */
    }
  }

  onReservarJefatura(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.dataSource.data.push({
      rangoHorario: {
        dia: this.dias_de_semana[form.controls['dia_semana'].value],
        hora_entrada: '5:00',
        hora_salida: '23:59',
      },
      parqueo: form.value.parqueo,
      placa: form.value.placa,
      idPersona: localStorage.getItem('id'),
      idReserva: '',
      idEspacio: '',
      nombreVisitante: '',
      nombreJefaturaAdmin: '',
      motivo: '',
      sitio: '',
      modelo: '',
      color: '',
    });
    this.refresh();
    form.resetForm();
    this.tiempo_entrada = { hour: this.horas, minute: this.minutos };
    this.tiempo_salida = { hour: this.horas, minute: this.minutos };
  }
}
