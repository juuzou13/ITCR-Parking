import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultarParqueosService } from '../services/consultar-parqueos.service';
import { ApexChart } from "ng-apexcharts";

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
  busquedaOn = false;
  parqueoNombres: any = [];
  parqueoCounts: any = [];

  departamentos = [];
  departamentoSeleccionado = '';
  titleDepartamento = '';

  chartColors: any[] = [
    { 
      backgroundColor:["#2741B9", "#FBF11D", "#4C1C6D", "#18A18A", "#248E11"] 
    }];

  ChartOptions = {
    series: [
      { data: [] }
    ],
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold"
        }
      },
      min: 0,
      max: 100
    },
    xaxis: {
      categories: []
    },
    legend: {
      show: false
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: "Helvetica, Arial, sans-serif"
      },
      onDatasetHover: {
          highlightDataSeries: false,
      },
      x: {
          show: false
      },
      y: {
          formatter: function(value: any, { series, seriesIndex, dataPointIndex, w }: any) {
            return w.globals.labels[dataPointIndex] + ': ' + value + '%';
          },
          title: {
              formatter: (seriesName: any) => '',
          },
      }
    }
  };

  apexChart: ApexChart = {
        type: "bar",
        height: 500,
        toolbar: {
          show: false
        }
      }

  public total: Number = 0;
  public horarios: Array<any> = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    private servicio_parqueos: ConsultarParqueosService
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
    
  }

  ngOnInit(): void {
    this.servicio_parqueos.getAllDepartamentos().subscribe({
      complete: () => {},
      error: (err: any) => {
        console.log(err);
      },
      next: (departamentos: any) => {
        this.departamentos = departamentos;
      }
    });

  }

  onBuscar(){
    this.busquedaOn = false;
    this.servicio_parqueos.getAll().subscribe({
      complete: () => {},
      error: (err: any) => {
        console.log(err);
      },
      next: (parqueos: any) => {
        // this.parqueoNombres = Array(parqueos.length).fill('').map((x, i) => parqueos[i]._id_parqueo);
        this.parqueoNombres = Array(parqueos.length).fill('');
        this.parqueoCounts = Array(parqueos.length).fill(0);

        parqueos.forEach((parqueo: any, index : any) => {
          if (parqueo._id_parqueo.length > 16) {
            this.parqueoNombres[index] = this.splitter(parqueo._id_parqueo);
          } else {
            this.parqueoNombres[index] = parqueo._id_parqueo;
          }
          parqueo.espacios.forEach((espacio: any) => {
            if (espacio.departamentoFuncionario == this.departamentoSeleccionado && espacio.ocupado == '1') {
              this.parqueoCounts[index]++;
            }
          });

          this.parqueoCounts[index] = parseFloat(((this.parqueoCounts[index] / parqueo.espacios.length) * 100).toFixed(2));
        });

        console.log('parqueoNombres', this.parqueoNombres);
        console.log('parqueoCounts', this.parqueoCounts);

        this.ChartOptions.series[0].data = this.parqueoCounts;
        this.ChartOptions.xaxis.categories = this.parqueoNombres;
        this.titleDepartamento = this.departamentoSeleccionado;
        this.busquedaOn = true;
      }
    });
  }

  splitter(string: any) {
    var middle = Math.floor(string.length / 2);
    var before = string.lastIndexOf(' ', middle);
    var after = string.indexOf(' ', middle + 1);

    if (before == -1 || (after != -1 && middle - before >= after - middle)) {
        middle = after;
    } else {
        middle = before;
    }

    var s1 = string.substr(0, middle);
    var s2 = string.substr(middle + 1);

    return [s1, s2];
}

}