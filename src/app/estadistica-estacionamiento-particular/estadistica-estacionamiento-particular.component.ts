import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { ConsultarParqueosService } from '../services/consultar-parqueos.service';


@Component({
  selector: 'app-estadistica-estacionamiento-particular',
  templateUrl: './estadistica-estacionamiento-particular.component.html',
  styleUrls: ['./estadistica-estacionamiento-particular.component.css']
})
export class EstadisticaEstacionamientoParticularComponent implements OnInit {

  cols: number = 2;
  parqueoEscogido = false;
  totalCount = 10;
  chartColors: any[] = [
    { 
      backgroundColor:["#2741B9", "#FBF11D", "#4C1C6D", "#18A18A", "#248E11"] 
    }];

  // En esta variable se almacenará la información de todos los parqueos de la BD
  parqueos: any = [];
  parqueoSeleccionado : any = [];

  button_toggle_active = false;
  show_chart = false;
  chartOptions = {
    responsive: true,
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItems: any, data: any) {
          return data.labels[tooltipItems.index] + ': ' + data.datasets[0].data[tooltipItems.index] + '%';
        }
      }
    },
  };

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
  public labelsGraficoTipo: Label[] = ['Jefatura', 'Ne. Especiales', 'Visitantes', 'V. Oficiales'];
  countTipo = Array(this.labelsGraficoTipo.length).fill(0);
  public labelsGraficoDpto: Label[] = [];
  countDepartamento: number[] = [];

  public datosGrafico: MultiDataSet = [[1, 2, 3, 4]];

  public doughnutChartType: ChartType = 'doughnut';

  public total: Number = 0;
  public horarios: Array<any> = [];

  campus: String = "";
  ngOnInit(): void {
    this.servicio_parqueos.getAllComboBox().subscribe({
      complete: () => {},
      error: (err: any) => { 
        console.log(err);
     },
     next: (res: any) => {
       this.parqueos = res;
     }
    })
  }

  activateButtons(group:any){
    this.button_toggle_active = true;
    this.show_chart = false;
    this.resetGraphics();
    group.value = '';
    console.log(this.show_chart);
  }

  resetGraphics(){
    this.datosGrafico= [[0, 0, 0]];
    this.countTipo = [0, 0, 0, 0];
    this.countDepartamento = [];
  }

  onToggle(toggleButton: any, parqueo:any) {
    this.show_chart = true;
    this.resetGraphics();
    this.labelsGrafico = [];

    this.servicio_parqueos.findByID(this.parqueoSeleccionado._id).subscribe({
      complete: () => {},
      error: (err: any) => {
        console.log(err);
      },
      next: (parqueo: any) => {
        console.log('espacios', parqueo.espacios);
        if (toggleButton.value ==  'dpto'){
          this.servicio_parqueos.getAllDepartamentos().subscribe({
            complete: () => {},
            error: (err: any) => {
              console.log(err);
            },
            next: (departamentos: any) => {
              this.countDepartamento = Array(departamentos.length).fill(0);
              this.labelsGraficoDpto = departamentos;

              parqueo.espacios.forEach((espacio: any) => {
                let departamentosEspacio: any = [];
                let splited: any = []

                if (espacio.departamentoFuncionario != '') {
                  splited = espacio.departamentoFuncionario.replaceAll('[', '').replaceAll(']', '').replaceAll('},', '}, ').split(', ');
              
                  departamentosEspacio = splited.map((obj: any) => {
                    console.log('obj', obj);
                    return JSON.parse(obj);
                  });
                }

                console.log('objetos', splited);
                console.log('departamentosEspacio', departamentosEspacio);

                const filtrados = Array.from(new Set(departamentosEspacio.map((item: any) => item.departamento)));


                filtrados.forEach((departamento: any) => {
                  for (let i = 0; i < departamentos.length; i++) {
                    if (departamento == departamentos[i] && espacio.ocupado == '1') {
                      this.countDepartamento[i]++;
                      break;
                    }
                  }
                });
              })

              const total = this.countDepartamento.reduce((partialSum, a) => partialSum + a, 0);
              console.log('total', total);
              for (let i = 0; i < this.countDepartamento.length; i++) {
                this.countDepartamento[i] = parseFloat(((this.countDepartamento[i] / total) * 100).toFixed(1));
              }

              this.onDpto = true;
              this.labelsGrafico = this.labelsGraficoDpto;
              this.onTipoEspacio = false;

              this.datosGrafico = [this.countDepartamento];
            }
          });
        } else if (toggleButton.value == 'tipo_espacio'){
          parqueo.espacios.forEach((espacio: any) => {
            if(espacio.tipo == 'JEFATURA' && espacio.ocupado == '1'){
              this.countTipo[0]++;
            } else if (espacio.tipo == 'ESPECIAL' && espacio.ocupado == '1'){
              this.countTipo[1]++;
            } else if (espacio.tipo == 'VISITANTE' && espacio.ocupado == '1'){
              this.countTipo[2]++;
            } else if (espacio.tipo == 'OFICIAL' && espacio.ocupado == '1'){
              this.countTipo[3]++;
            }
          })

          const total = this.countTipo.reduce((partialSum, a) => partialSum + a, 0);
          console.log('total', total);
          for (let i = 0; i < this.countTipo.length; i++) {
            this.countTipo[i] = parseFloat(((this.countTipo[i] / total) * 100).toFixed(1));
          }

          this.onDpto = false;
          this.onTipoEspacio = true;
          this.labelsGrafico = this.labelsGraficoTipo;

          this.datosGrafico = [this.countTipo];
        }
      }
    })

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
