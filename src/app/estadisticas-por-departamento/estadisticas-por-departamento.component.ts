import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadisticas-por-departamento',
  templateUrl: './estadisticas-por-departamento.component.html',
  styleUrls: ['./estadisticas-por-departamento.component.css']
})
export class EstadisticasPorDepartamentoComponent implements OnInit {

  cols: number = 2;
  gridByBreakpoint = {
    xl: 3,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1,
  };

  // Datos del departamento del que es jefatura el funcionario
  // para buscar los datos de los funcionarios
  campus_jefatura: string | null = localStorage.getItem('campus_jefatura');
  departamento_jefatura: string | null = localStorage.getItem('dpto_jefatura');

  departamentos = [];
  departamentoSeleccionado = '';

  public labelsGrafico: Label[] = ['Mañana', 'Tarde', 'Noche'];

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
  }

  resetGraphics(){
    
    this.datosGraficoL= [[0, 0, 0]];
    this.datosGraficoK= [[0, 0, 0]];
    this.datosGraficoM= [[0, 0, 0]];
    this.datosGraficoJ= [[0, 0, 0]];
    this.datosGraficoV= [[0, 0, 0]];
    this.datosGraficoS= [[0, 0, 0]];
  }

  ngOnInit(): void {
    
  }

  onParqueo(){
    this.resetGraphics();
  }

}
