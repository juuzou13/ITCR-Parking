import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Breakpoints } from '@angular/cdk/layout';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ocupacion-por-departamento',
  templateUrl: './ocupacion-por-departamento.component.html',
  styleUrls: ['./ocupacion-por-departamento.component.css']
})
export class OcupacionPorDepartamentoComponent implements OnInit {

  onGrafico = false;
  cols : number | undefined;
  gridByBreakpoint = {
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2
  }

  dias = [
    {value: 'lunes-0', viewValue: 'Lunes'},
    {value: 'martes-1', viewValue: 'Martes'},
    {value: 'miercoles-2', viewValue: 'Miércoles'},
    {value: 'jueves-3', viewValue: 'Jueves'},
    {value: 'viernes-4', viewValue: 'Viernes'},
    {value: 'sabado-5', viewValue: 'Sábado'}
  ];

  // aquí se guardarán los campus guardados en Mongo
  departamentos_registrados: any = [
    { nombre_campus: "SJ", departamento: "Arquitectura"},
    { nombre_campus: "CA", departamento: "Computación"},
    { nombre_campus: "LM", departamento: "Cultura y Deporte"},
  ]


  public barChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: true };
  // en estas etiquetas estarán los nombres de todos los parqueos registrados
  public barChartLabels: Label[] = ['Oasis', 'TEC Principal', 'Barrio Amón Parqueo'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Estacionamiento', barPercentage: 0.5 },
    
  ];
      public barChartColors: Color[] = [{ backgroundColor: "#0A4641" }];


  constructor(private breakpointObserver: BreakpointObserver, public router: Router,
    public dialogo: MatDialog,) { 
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
    }

  ngOnInit(): void {
  }

  onBuscar(form:NgForm){
    if(form.invalid){
      this.onGrafico = false;
      return;
    }
    this.onGrafico = true;
  }
}
