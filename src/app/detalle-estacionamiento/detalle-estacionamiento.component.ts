import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { DialogoConfirmacionComponent } from '../compartido/dialogo-confirmacion/dialogo-confirmacion.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Parqueo } from '../modelos/parqueo.model';

@Component({
  selector: 'app-detalle-estacionamiento',
  templateUrl: './detalle-estacionamiento.component.html',
  styleUrls: ['./detalle-estacionamiento.component.css']
})
export class DetalleEstacionamientoComponent implements OnInit {

  miParqueo: any = {
    _id: '',
    _id_parqueo: '',
    tipo: 'Subcontratado',
    capacidad_total: 50,
    capacidad_actual: 40,
    campus: 'SJ',
    espacios_jefatura: 5,
    espacios_VOficiales: 5,
    espacios_asignados: 5,
    espacios_visitantes: 5,
    espacios_NEspeciales: 5,
    direccion: 'Frente al TEC, Barrio Amón',
    contacto: '89228252',
    id_contrato: 'A-098',
    nombre:"OASIS"
  }

  displayedColumns: string[] = ['dia','entrada','salida'];
  dataSource: any;
  cols : number = 2;

  horario: any = [
    {dia: "Lunes", hora_entrada: "5:00am", hora_salida:"5:00pm"},
    {dia: "Martes", hora_entrada: "5:00am", hora_salida:"5:00pm"}
  ]
  
  @ViewChild(MatPaginator) paginatorHorario: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorHorario;
  }
  
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  constructor(private breakpointObserver: BreakpointObserver,
    public dialogo: MatDialog) {
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
    this.dataSource = new MatTableDataSource<any>(this.horario);
    this.dataSource.paginator = this.paginatorHorario;
  }

}
