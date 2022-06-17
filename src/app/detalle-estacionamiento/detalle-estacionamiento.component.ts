import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { DialogoConfirmacionComponent } from '../compartido/dialogo-confirmacion/dialogo-confirmacion.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Parqueo } from '../modelos/parqueo.model';
import { ConsultarParqueosService } from '../services/consultar-parqueos.service';

@Component({
  selector: 'app-detalle-estacionamiento',
  templateUrl: './detalle-estacionamiento.component.html',
  styleUrls: ['./detalle-estacionamiento.component.css']
})
export class DetalleEstacionamientoComponent implements OnInit {

  miParqueo: any = [];

  displayedColumns: string[] = ['dia','entrada','salida'];
  dataSource: any;
  cols : number = 2;

  @ViewChild(MatPaginator) paginatorHorario!: MatPaginator;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginatorHorario;
  }
  
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  constructor(private breakpointObserver: BreakpointObserver,
    private servicio_parqueos: ConsultarParqueosService, public dialogo: MatDialog) {
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
    const id = localStorage.getItem('idParqueoOperador') || '';
    this.servicio_parqueos.findByID(id).subscribe({
      complete: () => {},
      error: (err: any) => { 
       this.dialogo
       .open(DialogoInfoComponent, {
         data: 'Error: '+ err.error
       });
     },
     next: (res: any) => {
        this.miParqueo = res;
        this.dataSource = new MatTableDataSource<any>(this.miParqueo.horario);
        this.dataSource.paginator = this.paginatorHorario;
     }
    });

   
  }

}
