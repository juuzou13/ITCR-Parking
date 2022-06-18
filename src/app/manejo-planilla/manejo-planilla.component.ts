import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ManejoPlanillaService } from '../services/manejo-planilla.service';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';

@Component({
  selector: 'app-manejo-planilla',
  templateUrl: './manejo-planilla.component.html',
  styleUrls: ['./manejo-planilla.component.css']
})
export class ManejoPlanillaComponent implements OnInit, AfterViewInit {

  cols : number;
  rows: number;

  clickedRowTable1: any;
  clickedRowTable2: any;
  currentIndex: number;

  info: any;
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  constructor(private breakpointObserver: BreakpointObserver, public router: Router,
    private manejoPlanilla: ManejoPlanillaService, public dialogo: MatDialog) {
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
          this.rows = this.gridByBreakpoint.lg + 1;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
          this.rows = this.gridByBreakpoint.xl + 1;
        }
      }
    });
  }

  planillaArray : Array<any> = [];
  eliminablesArray: Array<any> = [];

  displayedColumns: string[] = ['nombre', 'tipoFuncionario', 'correoInstitucional'];
  dataSource : any;
  dataSourceEliminables: any;

  ngOnInit(): void {
    this.manejoPlanilla.getFuncionariosElegibles().subscribe({
      next: (res: any) => {
        let elegibles = res.filter((funcionario:any) => funcionario.tipo_funcionario != "Operador");
        console.log(elegibles);
        this.dataSource = new MatTableDataSource<String>(elegibles);
        this.planillaArray = this.dataSource.data;
        
      }
    });
    this.manejoPlanilla.getFuncionariosEliminables().subscribe({
      next: (res: any) => {
        this.dataSourceEliminables = new MatTableDataSource<String>(res);
        this.eliminablesArray = this.dataSourceEliminables.data;
      }
    });
    this.dataSourceEliminables = new MatTableDataSource<any>(this.eliminablesArray);
    this.dataSource = new MatTableDataSource<any>(this.planillaArray);
    this.refresh();
  }

  @ViewChild('paginatorAgregar') paginatorAgregar: MatPaginator;
  @ViewChild('paginatorEliminar') paginatorEliminar: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorAgregar;
    this.dataSourceEliminables.paginator = this.paginatorEliminar;
  }

  onClickRowTable1(row:any){
    this.clickedRowTable1 = row;
    console.log(row);
  }

  onClickRowTable2(row:any){
    this.clickedRowTable2 = row;
    console.log(row);
  }

  onAgregarFuncionario(){
    if(this.clickedRowTable1 != null){
      this.manejoPlanilla.addToPlanilla(this.clickedRowTable1).subscribe({
        error: (err: any) => { 
          this.dialogo
          .open(DialogoInfoComponent, {
            data: 'Error: '+ err.error
          });
        },
        next: (res: any) => {
          if(res == "Updated") {
            this.dialogo
            .open(DialogoInfoComponent, {
              data: 'El funcionario se agregó a la planilla.'
            });
          }
        }
      });
      this.dataSourceEliminables.data.push(this.clickedRowTable1);
      this.dataSourceEliminables.data = this.dataSourceEliminables.data;
      this.dataSourceEliminables.paginator = this.paginatorEliminar;
      this.planillaArray = this.planillaArray.filter(data => data.correo_institucional != this.clickedRowTable1.correo_institucional);
      this.dataSource.data = this.dataSource.data;
      this.dataSource = new MatTableDataSource<any>(this.planillaArray);
      this.dataSource.paginator = this.paginatorAgregar;
      this.refresh();
    }  
  }

  refresh() {
    this.dataSourceEliminables.data = this.dataSourceEliminables.data;
    this.dataSource.data = this.dataSource.data;
  }

  onEliminarFuncionario(){
    if(this.clickedRowTable2 != null){
      this.manejoPlanilla.deleteFromPlanilla(this.clickedRowTable2).subscribe({
        error: (err: any) => { 
          this.dialogo
          .open(DialogoInfoComponent, {
            data: 'Error: '+ err.error
          });
        },
        next: (res: any) => {
          if(res == "Deleted") {
            this.dialogo
            .open(DialogoInfoComponent, {
              data: 'El funcionario se eliminó de la planilla.'
            });
          }
        }
      });
      this.dataSource.data.push(this.clickedRowTable2);
      this.dataSource.data = this.dataSource.data;
      this.dataSource.paginator = this.paginatorAgregar;
      this.eliminablesArray = this.eliminablesArray.filter(data => data.correo_institucional != this.clickedRowTable2.correo_institucional);
      this.dataSourceEliminables.data = this.dataSourceEliminables.data;
      this.dataSourceEliminables = new MatTableDataSource<any>(this.eliminablesArray);
      this.dataSourceEliminables.paginator = this.paginatorEliminar;
      this.refresh();
    } 
  }

}
