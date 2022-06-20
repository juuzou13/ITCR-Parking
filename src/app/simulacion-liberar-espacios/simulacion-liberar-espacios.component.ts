import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { ConsultarParqueosService } from '../services/consultar-parqueos.service';
import { ReservarEspacioFuncionarioService } from '../services/reservar-espacio-funcionario.service';
import { Parqueo } from '../modelos/parqueo.model';
import { ConsultaFuncionarioService } from '../services/consulta-funcionario.service';

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
 

  tiempo_entrada = {hour: this.horas, minute: this.minutos};
  meridian = true;

  lista_funcionarios: any = []
  
  lista_parqueos: any = [];

  reservasActivas: any = [];
  idsParqueosDeReservasActivas: any = [];
  idsFuncionariosDeReservasActivas: any = [];
  reservasTerminadas: any = [];
  reservasEnRango: any = [];

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
    private reservarEspacioService: ReservarEspacioFuncionarioService,
    private consultaFuncionarioService: ConsultaFuncionarioService) {
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
        this.reservasActivas = res.filter((reserva:any) => {
          return reserva.idReserva != "OF";
        });
        this.idsParqueosDeReservasActivas = this.reservasActivas.map((reserva:any) => reserva.idParqueo)
        this.idsFuncionariosDeReservasActivas = this.reservasActivas.map((reserva:any) => reserva.idPersona)
      },
    });
    this.consultarParqueoService.getAll().subscribe({
      next: (res: any) => {
        this.lista_parqueos=res
      },
      error: (err: any) => {}
    });
    this.consultaFuncionarioService.getAllFuncionariosData().subscribe({
      next: (res: any) => {
        this.lista_funcionarios = res.filter((funcionario:any) => {
          return this.idsFuncionariosDeReservasActivas.includes(funcionario.identificacion);
        });
      }
    });
  }

  onSimularDiaHora(form: NgForm) {
    console.log("Reservas activas en el momento: ", this.reservasActivas)
    console.log("Parqueos de cada reserva: ", this.lista_parqueos)
    //console.log("Ids de parqueos de cada reserva: ", this.idsParqueosDeReservasActivas)
    //console.log("Ids de funcionarios de cada reserva: ", this.idsFuncionariosDeReservasActivas)
    console.log("Funcionarios activos: ", this.lista_funcionarios)

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

    this.reservasTerminadas = this.reservasActivas.filter((reserva:any) => {
      let fecha = new Date(reserva.rangoHorario.anio, reserva.rangoHorario.mes-1, reserva.rangoHorario.dia_mes, reserva.rangoHorario.hora_salida.split(":")[0], reserva.rangoHorario.hora_salida.split(":")[1]);
      
      return fecha < hora_ingresada && reserva.idReserva == "FUNC";
    })

    this.reservasEnRango = this.reservasActivas.filter((reserva:any) => {
      let fechaI = new Date(reserva.rangoHorario.anio, reserva.rangoHorario.mes-1, reserva.rangoHorario.dia_mes, reserva.rangoHorario.hora_entrada.split(":")[0], reserva.rangoHorario.hora_entrada.split(":")[1]);
      let fechaS = new Date(reserva.rangoHorario.anio, reserva.rangoHorario.mes-1, reserva.rangoHorario.dia_mes, reserva.rangoHorario.hora_salida.split(":")[0], reserva.rangoHorario.hora_salida.split(":")[1]);
       console.log(hora_ingresada, fechaI, fechaS)
      return fechaI <= hora_ingresada && fechaS >= hora_ingresada;
    })

    console.log(this.reservasTerminadas)
    console.log(this.reservasEnRango)

    let reservaActual:any = {};
    let espaciosDeParqueoACambiar: any = {};
    let indiceDeParqueo:number = 0;

    for(let i=0; i<this.reservasTerminadas.length; i++){
      reservaActual = this.reservasTerminadas[i];
      indiceDeParqueo = this.lista_parqueos.map((object: { _id: any }) => object._id).indexOf(reservaActual.idParqueo)
      espaciosDeParqueoACambiar = this.lista_parqueos[indiceDeParqueo].espacios;
      
      for(let j=0; j<espaciosDeParqueoACambiar.length; j++){
        if(espaciosDeParqueoACambiar[j]._id == reservaActual.idEspacio){
          espaciosDeParqueoACambiar[j].ocupado = "0";
          espaciosDeParqueoACambiar[j].departamentoFuncionario = "";
          break;
        }
      }

      this.lista_parqueos[indiceDeParqueo].espacios = espaciosDeParqueoACambiar;
    }

    let indicePersona:number = 0;

    for(let i=0; i<this.reservasEnRango.length; i++){
      reservaActual = this.reservasEnRango[i];
      indiceDeParqueo = this.lista_parqueos.map((object: { _id: any }) => object._id).indexOf(reservaActual.idParqueo)
      indicePersona = this.lista_funcionarios.map((object: { identificacion: any }) => object.identificacion).indexOf(reservaActual.idPersona)
      espaciosDeParqueoACambiar = this.lista_parqueos[indiceDeParqueo].espacios;
      
      for(let j=0; j<espaciosDeParqueoACambiar.length; j++){
        if(espaciosDeParqueoACambiar[j]._id == reservaActual.idEspacio){
          espaciosDeParqueoACambiar[j].ocupado = "1";
          try{
            const jsonString = JSON.stringify(this.lista_funcionarios[indicePersona].departamentos);
            espaciosDeParqueoACambiar[j].departamentoFuncionario = jsonString=="[]"? "": jsonString;
          } catch (e) {
            espaciosDeParqueoACambiar[j].departamentoFuncionario = "";
          }
          break;
        }
      }

      this.lista_parqueos[indiceDeParqueo].espacios = espaciosDeParqueoACambiar;
    }


    console.log("Lista parqueos actualizada: ", this.lista_parqueos)

    this.reservasTerminadas.forEach((reserva_actual:any) => {
      console.log("Borrando la reserva con id: ", reserva_actual._id)
      this.reservarEspacioService.deleteReservaActiva(reserva_actual._id).subscribe({
        next: (res: any) => {
          console.log("Delete done, reserva: ", reserva_actual._id, ".");
        },
        error: (err: any) => {}
      });
    })

    this.lista_parqueos.forEach((parqueo_actual:any) => {
      console.log("Actualizando parqueo con id: ", parqueo_actual._id)

      this.consultarParqueoService.updateByID(parqueo_actual).subscribe({
        next: (res: any) => {
          console.log("Update done.");
        },
        error: (err: any) => {}
      });

    })

    this.ngOnInit();
    this.dialogo
    .open(DialogoInfoComponent, {
      data: 'Simulación finalizada exitosamente.'
    })
    return;

  }
}