import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { RegistrarParqueoService } from '../services/registrar-parqueo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-liberar-espacios',
  templateUrl: './liberar-espacios.component.html',
  styleUrls: ['./liberar-espacios.component.css']
})
export class LiberarEspaciosComponent implements OnInit {

  parqueos_registrados = [{_id: "1", _id_parqueo: "Parqueo principal #1"}, {_id: "2", _id_parqueo: "Parqueo subcontratado #1"}];

  parqueo_seleccionado = false;

  cols : number = 0;
  rows: number = 0;

  clickedRowTable1: any;
  planillaArray : Array<any> = [];
  displayedColumns: string[] = ['dia_semana', 'hora_entrada', 'hora_salida'];
  dataSource : any;
  reservas_parqueo: any = [];

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  constructor(private breakpointObserver: BreakpointObserver, 
    config: NgbTimepickerConfig, public dialogo: MatDialog, private registrarParqueoService: RegistrarParqueoService) {
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
          this.rows = this.gridByBreakpoint.xs + 4;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
          this.rows = this.gridByBreakpoint.sm + 4;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
          this.rows = this.gridByBreakpoint.md + 4;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
          this.rows = this.gridByBreakpoint.lg + 4;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
          this.rows = this.gridByBreakpoint.xl + 4;
        }
      }
    });
    config.spinners = false;
  }

  @ViewChild('paginatorAgregar') paginatorAgregar: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorAgregar;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<String>(this.reservas_parqueo);
    this.planillaArray = this.dataSource.data;
    this.refresh();
  }

  onLiberarEspacio(form: NgForm) {
    if(form.invalid){
      return;
    } else if (this.clickedRowTable1 == null) {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: Debe seleccionar un horario reservado de la lista.'
      });
      return;
    }

    this.dialogo
    .open(DialogoInfoComponent, {
      data: 'El espacio se ha liberado exitosamente.'
    })
    .afterClosed()
      .subscribe(() => {
        /*Eliminar reserva y refrescar consulta de reservas de la base de datos.*/
        this.reservas_parqueo = [{rangoHorario: {dia: "lunes", hora_entrada: "5:00", 
        hora_salida: "23:59"}, parqueo: "", placa: "", idPersona: localStorage.getItem("id"),
        idReserva: "", idEspacio: "A1", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "",
        sitio: "", modelo: "", color: ""},{rangoHorario: {dia: "viernes", hora_entrada: "5:00", 
        hora_salida: "23:59"}, parqueo: "", placa: "", idPersona: localStorage.getItem("id"),
        idReserva: "", idEspacio: "V3", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "",
        sitio: "", modelo: "", color: ""}];
        this.dataSource = new MatTableDataSource<String>(this.reservas_parqueo);
        this.planillaArray = this.dataSource.data;
        this.refresh();
      });
  }

  onClickRowTable1(row:any){
    this.clickedRowTable1 = row;
  }

  refresh() {
    this.dataSource.data = this.dataSource.data;
  }

  clickListaParqueo(form: NgForm) {
    form.resetForm();
    this.parqueo_seleccionado = false;
    this.clickedRowTable1 = null;
    this.reservas_parqueo = [];
    this.dataSource = new MatTableDataSource<String>(this.reservas_parqueo);
    this.planillaArray = this.dataSource.data;
    this.refresh();
  }

  seleccionarParqueo() {
    this.parqueo_seleccionado = true;
    /*Consultar las reservas que tienen el id del parqueo seleccionado.*/
    this.reservas_parqueo = [{rangoHorario: {dia: "lunes", hora_entrada: "5:00", 
    hora_salida: "23:59"}, parqueo: "", placa: "", idPersona: localStorage.getItem("id"),
    idReserva: "", idEspacio: "A1", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "",
    sitio: "", modelo: "", color: ""},{rangoHorario: {dia: "miércoles", hora_entrada: "5:00", 
    hora_salida: "23:59"}, parqueo: "", placa: "", idPersona: localStorage.getItem("id"),
    idReserva: "", idEspacio: "E2", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "",
    sitio: "", modelo: "", color: ""},{rangoHorario: {dia: "viernes", hora_entrada: "5:00", 
    hora_salida: "23:59"}, parqueo: "", placa: "", idPersona: localStorage.getItem("id"),
    idReserva: "", idEspacio: "V3", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "",
    sitio: "", modelo: "", color: ""}];
  }

  seleccionarEspacio() {
    /*Consultar las reservas que tienen el id del parqueo seleccionado y el espacio seleccionado.*/
    this.reservas_parqueo = [{rangoHorario: {dia: "lunes", hora_entrada: "5:00", 
    hora_salida: "23:59"}, parqueo: "", placa: "", idPersona: localStorage.getItem("id"),
    idReserva: "", idEspacio: "A1", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "",
    sitio: "", modelo: "", color: ""},{rangoHorario: {dia: "miércoles", hora_entrada: "5:00", 
    hora_salida: "23:59"}, parqueo: "", placa: "", idPersona: localStorage.getItem("id"),
    idReserva: "", idEspacio: "E2", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "",
    sitio: "", modelo: "", color: ""},{rangoHorario: {dia: "viernes", hora_entrada: "5:00", 
    hora_salida: "23:59"}, parqueo: "", placa: "", idPersona: localStorage.getItem("id"),
    idReserva: "", idEspacio: "V3", nombreVisitante: "", nombreJefaturaAdmin: "", motivo: "",
    sitio: "", modelo: "", color: ""}];
    this.dataSource = new MatTableDataSource<String>(this.reservas_parqueo);
    this.planillaArray = this.dataSource.data;
    this.refresh();
  }

}
