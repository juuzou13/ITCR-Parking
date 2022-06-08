import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-menu-principal-funcionario',
  templateUrl: './menu-principal-funcionario.component.html',
  styleUrls: ['./menu-principal-funcionario.component.css']
})
export class MenuPrincipalFuncionarioComponent implements OnInit {

  items = Array.from({length: 10}).map((_, i) => `Item #${i}`);

  cols : number;
  jefatura: any;
  nombre_perfil = "";

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 2,
    xs: 1
  }
  
  constructor(private breakpointObserver: BreakpointObserver, private router:Router,
    private loginService: LoginService) {
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
    if(this.loginService.getJefatura() == "0") {
      this.jefatura = 0;
    } else if(this.loginService.getJefatura() == "1") {
      this.jefatura = 1;
    }
    this.nombre_perfil = localStorage['nombre_completo'];
  }

  onMenuPrincipal(form: NgForm){
    if(form.invalid){
        return;
    }
  }

  registrarHorario() {
    this.router.navigate(['/registro-horario']);
  }

  manejarPlanilla() {
    this.router.navigate(['/manejo-planilla']);
  }

}
