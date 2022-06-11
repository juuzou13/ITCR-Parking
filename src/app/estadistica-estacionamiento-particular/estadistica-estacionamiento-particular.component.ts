import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { EstadisticasFHService } from '../services/estadisticas-fh.service';


@Component({
  selector: 'app-estadistica-estacionamiento-particular',
  templateUrl: './estadistica-estacionamiento-particular.component.html',
  styleUrls: ['./estadistica-estacionamiento-particular.component.css']
})
export class EstadisticaEstacionamientoParticularComponent implements OnInit {

  cols: number = 2;
  parqueoEscogido = false;
  chartColors: any[] = [
    { 
      backgroundColor:["#2741B9", "#FBF11D", "#4C1C6D", "#18A18A", "#248E11"] 
    }];


  parqueoSeleccionado : any = [];

  // En esta variable se almacenará la información de todos los parqueos de la BD
  parqueos: any = [
    {_id_parqueo: "OASIS"},
    {_id_parqueo: "TEC Principal"},
    {_id_parqueo: "Barrio Amón Parqueo"}
  ]


  button_toggle_active = false;
  show_chart = false;

  info: any;
  onDpto = false;
  onTipoEspacio = false;
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

  // Se tienen labels y MultiDataSets diferentes dependiendo de la clasificación escogida

  public labelsGrafico: Label[] = [];
  public labelsGraficoTipo: Label[] = ['Jefatura', 'Discapacidad', 'Visitantes', 'V. Oficiales'];
  public labelsGraficoDpto: Label[] = ['Física', 'Computación', 'Arquitectura', 'Matemática', 'Cultura y Deporte'];

  public datosGraficoL: MultiDataSet = [[1, 2, 3, 4]];
  public datosGraficoK: MultiDataSet = [[0, 0, 3, 0]];
  public datosGraficoM: MultiDataSet = [[0, 0, 2, 0]];
  public datosGraficoJ: MultiDataSet = [[0, 2, 0, 0]];
  public datosGraficoV: MultiDataSet = [[0, 2, 0, 0]];
  public datosGraficoS: MultiDataSet = [[0, 2, 0, 6]];

  public datosGraficoLTipo: MultiDataSet = [[1, 2, 3, 4]];
  public datosGraficoKTipo: MultiDataSet = [[0, 0, 3, 0]];
  public datosGraficoMTipo: MultiDataSet = [[0, 0, 2, 0]];
  public datosGraficoJTipo: MultiDataSet = [[0, 2, 0, 0]];
  public datosGraficoVTipo: MultiDataSet = [[0, 2, 0, 0]];
  public datosGraficoSTipo: MultiDataSet = [[0, 2, 0, 6]];

  public datosGraficoLDpto: MultiDataSet = [[1, 2, 3, 4, 2]];
  public datosGraficoKDpto: MultiDataSet = [[0, 0, 3, 0, 1]];
  public datosGraficoMDpto: MultiDataSet = [[0, 0, 2, 0, 4]];
  public datosGraficoJDpto: MultiDataSet = [[0, 2, 0, 0, 4]];
  public datosGraficoVDpto: MultiDataSet = [[0, 2, 0, 0, 5]];
  public datosGraficoSDpto: MultiDataSet = [[0, 2, 0, 6, 5]];

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
  ngOnInit(): void {}

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

  onToggle(toggleButton: any, parqueo:any) {
    this.show_chart = true;
    this.resetGraphics();
    this.labelsGrafico = [];
    if (toggleButton.value ==  'dpto'){
      this.onDpto = true;
      this.labelsGrafico = this.labelsGraficoDpto;
      this.onTipoEspacio = false;
      this.datosGraficoL = this.datosGraficoLDpto;
      this.datosGraficoK = this.datosGraficoKDpto;
      this.datosGraficoM = this.datosGraficoMDpto;
      this.datosGraficoJ = this.datosGraficoJDpto;
      this.datosGraficoV = this.datosGraficoVDpto;
      this.datosGraficoS = this.datosGraficoSDpto;

    } else if (toggleButton.value == 'tipo_espacio'){
      this.onDpto = false;
      this.onTipoEspacio = true;
      this.labelsGrafico = this.labelsGraficoTipo;

      this.datosGraficoL = this.datosGraficoLTipo;
      this.datosGraficoK = this.datosGraficoKTipo;
      this.datosGraficoM = this.datosGraficoMTipo;
      this.datosGraficoJ = this.datosGraficoJTipo;
      this.datosGraficoV = this.datosGraficoVTipo;
      this.datosGraficoS = this.datosGraficoSTipo;
    }
    console.log(toggleButton.value);
    console.log(parqueo._id_parqueo);
  }
  onParqueo(){
    this.resetGraphics();
    this.parqueoEscogido = true;
    this.onDpto = false;
    this.onTipoEspacio = false;
  }
}
