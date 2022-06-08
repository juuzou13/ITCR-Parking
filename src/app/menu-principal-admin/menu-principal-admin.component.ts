import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-menu-principal-admin',
  templateUrl: './menu-principal-admin.component.html',
  styleUrls: ['./menu-principal-admin.component.css']
})
export class MenuPrincipalAdminComponent implements OnInit {

  items = Array.from({length: 10}).map((_, i) => `Item #${i}`);

  cols : number = 0;
  nombre_perfil = "";

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 2,
    xs: 1
  }
  
  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
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

  displayedColumns: string[] = ['Departamento'];
  dataSource = new MatTableDataSource<String>(this.items);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    
    this.nombre_perfil = localStorage['nombre_completo'];
  }

  onMenuPrincipal(form: NgForm){
    if(form.invalid){
        return;
    }
  }

  registrarParqueo() {
    this.router.navigate(['/registrar-parqueo']);
  }


}
