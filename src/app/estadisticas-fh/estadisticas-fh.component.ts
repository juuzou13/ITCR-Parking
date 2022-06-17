import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { EstadisticasFHService } from '../services/estadisticas-fh.service';

@Component({
  selector: 'app-estadisticas-fh',
  templateUrl: './estadisticas-fh.component.html',
  styleUrls: ['./estadisticas-fh.component.css'],
})
export class EstadisticasFHComponent implements OnInit {
  cols: number = 2;

  campusD = ["Cartago", "San José", "Alajuela", "San Carlos", "Limón"];
  selectCampus = 0;
  
  button_toggle_active = false;
  show_chart = false;
  showToggle = false;

  admin = localStorage.getItem('admin') == '1';
  funcionario_estandar = localStorage.getItem('jefatura') == '0';
  campus_jefatura = localStorage.getItem('campus_jefatura')||'';
  dpto_jefatura = localStorage.getItem('dpto_jefatura')||'';

  info: any;
  onAdm = false;
  onDoc = false;
  onAmbos = false;
  pantalla_pequenia = false;
  gridByBreakpoint = {
    xl: 3,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1,
  };
  constructor(
    private breakpointObserver: BreakpointObserver,
    private estadisticas_fh_service: EstadisticasFHService,
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
            this.pantalla_pequenia = true;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.cols = this.gridByBreakpoint.sm;
            this.pantalla_pequenia = false;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.cols = this.gridByBreakpoint.md;
            this.pantalla_pequenia = false;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.cols = this.gridByBreakpoint.lg;
            this.pantalla_pequenia = false;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.cols = this.gridByBreakpoint.xl;
            this.pantalla_pequenia = false;
          }
        }
      });
  }
  public labelsGrafico: Label[] = ['Mañana', 'Tarde', 'Noche'];
  public datosGrafico: MultiDataSet = [[0, 0, 0]];

  public datosGraficoL: MultiDataSet = [[0, 0, 0]];
  public datosGraficoK: MultiDataSet = [[0, 0, 0]];
  public datosGraficoM: MultiDataSet = [[0, 0, 0]];
  public datosGraficoJ: MultiDataSet = [[0, 0, 0]];
  public datosGraficoV: MultiDataSet = [[0, 0, 0]];
  public datosGraficoS: MultiDataSet = [[0, 0, 0]];

  public doughnutChartType: ChartType = 'doughnut';

  public total: Number = 0;
  public horarios: Array<any> = [];

  public horariosLunes: Array<any> = [];
  public horariosMartes: Array<any> = [];
  public horariosMiercoles: Array<any> = [];
  public horariosJueves: Array<any> = [];
  public horariosViernes: Array<any> = [];
  public horariosSabado: Array<any> = [];

  public horariosToSort: Array<any> = [];

  campus: String = "";
  ngOnInit(): void {
    if(!this.admin){
      if (!this.funcionario_estandar) {
        this.onAdm = true;
      }
      this.showToggle = true;
      this.selectCampus = this.campusD.indexOf(this.campus_jefatura);
    }else{
      this.funcionario_estandar = true;
    }
  }

  onBuscar(){
    this.showToggle = true;
  };

  determineDayTime(time: number): number {
    // 0 es mañana
    // 1 es tarde
    // 2 es noche

    if (0 <= time && time < 12) {
      return 0;
    } else if (12 <= time && time < 18) {
      return 1;
    } else if (18 <= time && time < 24) {
      return 2;
    } else {
      return -1;
    }
  }

  activateButtons(group:any){
    this.button_toggle_active = true;
    this.show_chart = false;
    this.resetGraphics();
    group.value = '';
    console.log(this.show_chart);
  }

  resetGraphics(){
    
    this.datosGraficoL= [[0, 0, 0]];
    this.datosGraficoK= [[0, 0, 0]];
    this.datosGraficoM= [[0, 0, 0]];
    this.datosGraficoJ= [[0, 0, 0]];
    this.datosGraficoV= [[0, 0, 0]];
    this.datosGraficoS= [[0, 0, 0]];
  }
  separateTimePeriods(total: number, times: Array<any>): Array<any> {
    this.horariosToSort = [];

    var prevTime = 0;

    var matutino = 0;
    var vespertino = 0;
    var nocturno = 0;

    var differentTimes = total;

    

    for (let index = 0; index < total; index++) {
      var time = times[index].hora_entrada;
      var splitted = time.split(':', 2);
      var hour = +splitted[0];
      var minutes = +splitted[1] == 0 ? 0 : 100 / (60 / +splitted[1]) / 100;
      var convertedTime = hour + minutes;

      console.log(hour, minutes);
      console.log(convertedTime);

      prevTime = this.determineDayTime(convertedTime);

      switch (prevTime) {
        case 0:
          matutino += 1;
          break;

        case 1:
          vespertino += 1;
          break;

        case 2:
          nocturno += 1;
          break;

        default:
          break;
      }

      var time = times[index].hora_salida;
      var splitted = time.split(':', 2);
      var hour = +splitted[0];
      var minutes = +splitted[1] == 0 ? 0 : 100 / (60 / +splitted[1]) / 100;
      var convertedTime = hour + minutes;

      console.log(hour, minutes);
      console.log(convertedTime);

      var diff = Math.abs(prevTime - this.determineDayTime(convertedTime))

      if (diff) {
        
        differentTimes += diff;

        while(diff-- > 0){
          prevTime++
          if (prevTime>2) {
            prevTime = 0
          }
          switch (prevTime) {

            case 0:
              matutino += 1;
              break;
  
            case 1:
              vespertino += 1;
              break;
  
            case 2:
              nocturno += 1;
              break;
  
            default:
              break;
            
          }
        }

        
      }
    }
    return [matutino, vespertino, nocturno];
  }

  onToggle(toggleButton: any, campus:any) {
    console.log('selectCampus', this.selectCampus);
    this.show_chart = true;
    let campusS = this.campusD[this.selectCampus];
    console.log("Campus: ", campusS);
    console.log(toggleButton.value);

    this.campus = this.campusD[this.selectCampus];
    this.horariosLunes = [];
    this.horariosMartes = [];
    this.horariosMiercoles = [];
    this.horariosJueves = [];
    this.horariosViernes = [];
    this.horariosSabado = [];

    this.resetGraphics();

    if (toggleButton.value == 'doc') {
      console.log('Por Docente');
      this.onAdm = false;
      this.onAmbos = false;
      this.onDoc = true;
      this.estadisticas_fh_service
        .getFuncionarioDocData(this.campus)
        .subscribe({
          complete: () => {},
          next: (res: any) => {
            if (res) {
              this.total = res.length;

              
              if(this.funcionario_estandar){

                let horariosFunc = []
                for (let index = 0; index < res.length; index++) {
                  //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                  for (let index2 = 0; index2 < res[index].horario.length; index2++) {
                    //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                    horariosFunc.push(res[index].horario[index2])
                  }
                }
                
                this.horarios = horariosFunc;
              }else{
                console.log("func: ", res);
                let funcionarios_dpto=[]
                funcionarios_dpto = res.filter((funcionario: any) => {
                
                  for(let index = 0; index < funcionario.departamentos.length; index++){
                    if(funcionario.departamentos[index].campus == this.campus_jefatura && funcionario.departamentos[index].departamento == this.dpto_jefatura){
                      return funcionario;
                    }
                  }
  
                });;

                let horariosFunc = []
                for (let index = 0; index < funcionarios_dpto.length; index++) {
                  //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                  for (let index2 = 0; index2 < funcionarios_dpto[index].horario.length; index2++) {
                    //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                    horariosFunc.push(funcionarios_dpto[index].horario[index2])
                  }
                }

                this.horarios = horariosFunc;
              }

              console.log(this.horarios);
              for (let index = 0; index < this.horarios.length; index++) {
                var horario = this.horarios[index];
                var dia = horario.dia;
                var entrada = horario.hora_entrada;
                var salida = horario.hora_salida;

                switch (dia) {
                  case 'lunes':
                    this.horariosLunes.push(horario);
                    break;

                  case 'martes':
                    this.horariosMartes.push(horario);
                    break;

                  case 'miercoles':
                    this.horariosMiercoles.push(horario);
                    break;

                  case 'jueves':
                    this.horariosJueves.push(horario);
                    break;

                  case 'viernes':
                    this.horariosViernes.push(horario);
                    break;

                  case 'sabado':
                    this.horariosSabado.push(horario);
                    break;

                  default:
                    break;
                }
              }

              console.log(this.horariosLunes);
              console.log(this.horariosMartes);
              console.log(this.horariosMiercoles);
              console.log(this.horariosJueves);
              console.log(this.horariosViernes);
              console.log(this.horariosSabado);

              this.datosGraficoL = [
                this.separateTimePeriods(
                  this.horariosLunes.length,
                  this.horariosLunes
                ),
              ];
              this.datosGraficoK = [
                this.separateTimePeriods(
                  this.horariosMartes.length,
                  this.horariosMartes
                ),
              ];
              this.datosGraficoM = [
                this.separateTimePeriods(
                  this.horariosMiercoles.length,
                  this.horariosMiercoles
                ),
              ];
              this.datosGraficoJ = [
                this.separateTimePeriods(
                  this.horariosJueves.length,
                  this.horariosJueves
                ),
              ];
              this.datosGraficoV = [
                this.separateTimePeriods(
                  this.horariosViernes.length,
                  this.horariosViernes
                ),
              ];
              this.datosGraficoS = [
                this.separateTimePeriods(
                  this.horariosSabado.length,
                  this.horariosSabado
                ),
              ];
            }
          },
        });
    } else if (toggleButton.value == 'adm') {
      console.log('Por admin');
      this.onAdm = true;
      this.onAmbos = false;
      this.onDoc = false;
      this.estadisticas_fh_service
        .getFuncionarioAdmData(this.campus)
        .subscribe({
          complete: () => {},
          next: (res: any) => {
            if (res) {
              this.total = res.length;
              if(this.funcionario_estandar){

                let horariosFunc = []
                for (let index = 0; index < res.length; index++) {
                  //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                  for (let index2 = 0; index2 < res[index].horario.length; index2++) {
                    //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                    horariosFunc.push(res[index].horario[index2])
                  }
                }
                
                this.horarios = horariosFunc;
              }else{
                console.log("func: ", res);
                let funcionarios_dpto=[]
                funcionarios_dpto = res.filter((funcionario: any) => {
                
                  for(let index = 0; index < funcionario.departamentos.length; index++){
                    if(funcionario.departamentos[index].campus == this.campus_jefatura && funcionario.departamentos[index].departamento == this.dpto_jefatura){
                      return funcionario;
                    }
                  }
  
                });;

                let horariosFunc = []
                for (let index = 0; index < funcionarios_dpto.length; index++) {
                  //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                  for (let index2 = 0; index2 < funcionarios_dpto[index].horario.length; index2++) {
                    //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                    horariosFunc.push(funcionarios_dpto[index].horario[index2])
                  }
                }

                this.horarios = horariosFunc;
              }

              console.log(this.horarios);
              for (let index = 0; index < this.horarios.length; index++) {
                var horario = this.horarios[index];
                var dia = horario.dia;
                var entrada = horario.hora_entrada;
                var salida = horario.hora_salida;

                switch (dia) {
                  case 'lunes':
                    this.horariosLunes.push(horario);
                    break;

                  case 'martes':
                    this.horariosMartes.push(horario);
                    break;

                  case 'miercoles':
                    this.horariosMiercoles.push(horario);
                    break;

                  case 'jueves':
                    this.horariosJueves.push(horario);
                    break;

                  case 'viernes':
                    this.horariosViernes.push(horario);
                    break;

                  case 'sabado':
                    this.horariosSabado.push(horario);
                    break;

                  default:
                    break;
                }
              }

              console.log(this.horariosLunes);
              console.log(this.horariosMartes);
              console.log(this.horariosMiercoles);
              console.log(this.horariosJueves);
              console.log(this.horariosViernes);
              console.log(this.horariosSabado);

              this.datosGraficoL = [
                this.separateTimePeriods(
                  this.horariosLunes.length,
                  this.horariosLunes
                ),
              ];
              this.datosGraficoK = [
                this.separateTimePeriods(
                  this.horariosMartes.length,
                  this.horariosMartes
                ),
              ];
              this.datosGraficoM = [
                this.separateTimePeriods(
                  this.horariosMiercoles.length,
                  this.horariosMiercoles
                ),
              ];
              this.datosGraficoJ = [
                this.separateTimePeriods(
                  this.horariosJueves.length,
                  this.horariosJueves
                ),
              ];
              this.datosGraficoV = [
                this.separateTimePeriods(
                  this.horariosViernes.length,
                  this.horariosViernes
                ),
              ];
              this.datosGraficoS = [
                this.separateTimePeriods(
                  this.horariosSabado.length,
                  this.horariosSabado
                ),
              ];
            }
          },
        });
    } else {
      console.log('Por Ambos');
      this.onAdm = false;
      this.onAmbos = true;
      this.onDoc = false;
      this.estadisticas_fh_service
        .getFuncionarioAmbosData(this.campus)
        .subscribe({
          complete: () => {},
          next: (res: any) => {
            if (res) {
              this.total = res.length;
              if(this.funcionario_estandar){

                let horariosFunc = []
                for (let index = 0; index < res.length; index++) {
                  //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                  for (let index2 = 0; index2 < res[index].horario.length; index2++) {
                    //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                    horariosFunc.push(res[index].horario[index2])
                  }
                }
                
                this.horarios = horariosFunc;
              }else{
                console.log("func: ", res);
                let funcionarios_dpto=[]
                funcionarios_dpto = res.filter((funcionario: any) => {
                
                  for(let index = 0; index < funcionario.departamentos.length; index++){
                    if(funcionario.departamentos[index].campus == this.campus_jefatura && funcionario.departamentos[index].departamento == this.dpto_jefatura){
                      return funcionario;
                    }
                  }
  
                });;

                let horariosFunc = []
                for (let index = 0; index < funcionarios_dpto.length; index++) {
                  //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                  for (let index2 = 0; index2 < funcionarios_dpto[index].horario.length; index2++) {
                    //console.log(placasFuncionario.placas_asociadas[index].codigo_placa);  
                    horariosFunc.push(funcionarios_dpto[index].horario[index2])
                  }
                }

                this.horarios = horariosFunc;
              }

              console.log(this.horarios);
              for (let index = 0; index < this.horarios.length; index++) {
                var horario = this.horarios[index];
                var dia = horario.dia;
                var entrada = horario.hora_entrada;
                var salida = horario.hora_salida;

                switch (dia) {
                  case 'lunes':
                    this.horariosLunes.push(horario);
                    break;

                  case 'martes':
                    this.horariosMartes.push(horario);
                    break;

                  case 'miercoles':
                    this.horariosMiercoles.push(horario);
                    break;

                  case 'jueves':
                    this.horariosJueves.push(horario);
                    break;

                  case 'viernes':
                    this.horariosViernes.push(horario);
                    break;

                  case 'sabado':
                    this.horariosSabado.push(horario);
                    break;

                  default:
                    break;
                }
              }

              console.log(this.horariosLunes);
              console.log(this.horariosMartes);
              console.log(this.horariosMiercoles);
              console.log(this.horariosJueves);
              console.log(this.horariosViernes);
              console.log(this.horariosSabado);

              this.datosGraficoL = [
                this.separateTimePeriods(
                  this.horariosLunes.length,
                  this.horariosLunes
                ),
              ];
              this.datosGraficoK = [
                this.separateTimePeriods(
                  this.horariosMartes.length,
                  this.horariosMartes
                ),
              ];
              this.datosGraficoM = [
                this.separateTimePeriods(
                  this.horariosMiercoles.length,
                  this.horariosMiercoles
                ),
              ];
              this.datosGraficoJ = [
                this.separateTimePeriods(
                  this.horariosJueves.length,
                  this.horariosJueves
                ),
              ];
              this.datosGraficoV = [
                this.separateTimePeriods(
                  this.horariosViernes.length,
                  this.horariosViernes
                ),
              ];
              this.datosGraficoS = [
                this.separateTimePeriods(
                  this.horariosSabado.length,
                  this.horariosSabado
                ),
              ];
            }
          },
        });
    }
  }
}
