import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { RegistrarVehiculoService } from '../services/registrar-vehiculo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-vehiculo',
  templateUrl: './registrar-vehiculo.component.html',
  styleUrls: ['./registrar-vehiculo.component.css']
})
export class RegistrarVehiculoComponent implements OnInit {

  placas : any = [];
  cols : number;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }
  
  constructor(private breakpointObserver: BreakpointObserver,
    public dialogo: MatDialog, private registrarVehiculoService : RegistrarVehiculoService,
    public router: Router) {
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

  displayedColumns: string[] = ['Vehículo','Eliminar'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.registrarVehiculoService.getVehiculos().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<String>(res);
        this.placas = this.dataSource.data;
        this.refresh();
      }
    });
    this.dataSource = new MatTableDataSource<String>(this.placas);
    this.refresh();
  }

  onRegistrarVehiculo(form: NgForm) {
    if(form.invalid){
      return;
    } else {
      if(!this.placas.some((e: { codigo_placa: any; }) => e.codigo_placa === form.value.placa)) {
        this.dataSource.data.push({codigo_placa: form.value.placa, _id: ''});
        this.refresh();
      } else {
        
        this.dialogo
        .open(DialogoInfoComponent, {
          data: 'Error: La placa ya está en la lista'
        });
      }
    }
  }
  refresh() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.dataSource.data;
  }

  onEliminarExtracto(index: number) {
    this.dataSource.data.splice(index, 1);
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.dataSource.data;
  }

  finalizarRegistro() {
    this.registrarVehiculoService.updateVehiculos(this.dataSource.data).subscribe({
      next: (res: any) => {
        if(res == "Updated") {
          this.dialogo
          .open(DialogoInfoComponent, {
            data: 'Lista de vehículos actualizada.'
          })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate(['/menu-principal-func']).then(() => {
              window.location.reload();
            });
          });
        }
      }
    });
  }

}
