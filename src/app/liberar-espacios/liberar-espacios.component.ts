import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { RegistrarParqueoService } from '../services/registrar-parqueo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ReservarEspacioFuncionarioService } from '../services/reservar-espacio-funcionario.service';
@Component({
  selector: 'app-liberar-espacios',
  templateUrl: './liberar-espacios.component.html',
  styleUrls: ['./liberar-espacios.component.css']
})
export class LiberarEspaciosComponent implements OnInit {

  reservasOficialesOVisitantes: any = [];
  cols : number = 0;
  rows: number = 0;

  idParqueo = localStorage.getItem('idParqueoOperador');
  parqueoReservado:any;

  showID = false;

  clickedRowTable1: any;
  planillaArray : Array<any> = [];
  displayedColumns: string[] = ['fecha','id_persona', 'hora_entrada', 'id_espacio', 'placa', 'tipo', '_id'];
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
    config: NgbTimepickerConfig, public dialogo: MatDialog, private registrarParqueoService: RegistrarParqueoService,
    private reservarEspacioFuncionarioService: ReservarEspacioFuncionarioService) {
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

  @ViewChild('paginatorAgregar')
  paginatorAgregar!: MatPaginator;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginatorAgregar;
  }

  ngOnInit(): void {
    this.reservarEspacioFuncionarioService.getParqueo(this.idParqueo).subscribe({
      next: (res: any) => {
        this.parqueoReservado = res;
      },
    });

    this.reservarEspacioFuncionarioService.findReservasParaOperador(localStorage.getItem('idParqueoOperador')).subscribe({
      next: (res: any) => {
        for(let i = 0; i < res.length; i++){
          if(res[i].idReserva == 'VIS' || res[i].idReserva == 'OF'){
            this.reservasOficialesOVisitantes.push(res[i]);
          }
        }    
        this.dataSource = new MatTableDataSource<String>(this.reservasOficialesOVisitantes);
        this.dataSource.paginator = this.paginatorAgregar;
        this.planillaArray = this.dataSource.data;
        this.refresh();   
      },
    });
    
  }

  onLiberarEspacio(form: NgForm) {
    if(form.invalid){
      return;
    } else if (this.clickedRowTable1 == null) {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: Debe seleccionar un elemento de la lista.'
      });
      return;
    }

    this.reservarEspacioFuncionarioService.deleteReserva(this.clickedRowTable1._id).subscribe({
      error: (err: any) => {},
      next: (res: any) => {}
    });

    for(let i = 0; i < this.parqueoReservado.espacios.length; i++){
      if(this.parqueoReservado.espacios[i]._id == this.clickedRowTable1.idEspacio){
        this.parqueoReservado.espacios[i].ocupado = '0';
        console.log(this.parqueoReservado.espacios[i]);
      }
    }
    this.reservarEspacioFuncionarioService.ocuparCampo(this.parqueoReservado).subscribe({
      next: (res: any) => {
      },
      error: (err: any) => {
      }
    });

    this.dialogo
    .open(DialogoInfoComponent, {
      data: 'El espacio se ha liberado exitosamente.'
    });
    let temp: any = [];
    for(let i = 0; i < this.reservasOficialesOVisitantes.length; i++){
      if(this.reservasOficialesOVisitantes[i]._id == this.clickedRowTable1._id){
        continue;
      }
      else{
        temp.push(this.reservasOficialesOVisitantes[i]);
      }
    }
    this.reservasOficialesOVisitantes = temp;
    
    this.dataSource = new MatTableDataSource<any>(this.reservasOficialesOVisitantes);
    this.dataSource.paginator = this.paginatorAgregar;
    
    this.refresh();
  }

  onClickRowTable1(row:any){
    this.clickedRowTable1 = row;
  }

  refresh() {
    this.dataSource.paginator = this.paginatorAgregar;
    this.dataSource.data = this.dataSource.data;
  }

}
