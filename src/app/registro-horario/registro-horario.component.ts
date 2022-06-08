import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { RegistrarHorarioService } from '../services/registrar-horario.service'

@Component({
  selector: 'app-registro-horario',
  templateUrl: './registro-horario.component.html',
  styleUrls: ['./registro-horario.component.css']
})
export class RegistroHorarioComponent implements OnInit, AfterViewInit {

  cols : number;
  diaNewHorario:String;
  horaEntradaNewHorario:String;
  horaSalidaNewHorario:String;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }

  dias = [
    {value: 'lunes-0', viewValue: 'Lunes'},
    {value: 'martes-1', viewValue: 'Martes'},
    {value: 'miercoles-2', viewValue: 'Miércoles'},
    {value: 'jueves-3', viewValue: 'Jueves'},
    {value: 'viernes-4', viewValue: 'Viernes'},
    {value: 'sabado-5', viewValue: 'Sábado'}
  ];

  horarioArray:any = [];

  displayedColumns: string[] = ['dia', 'entrada', 'salida', 'delete'];
  dataSource: any;

  fecha = new Date();
  horas = this.fecha.getHours();
  minutos = this.fecha.getMinutes();
  error_horario = false;
  periodo_minutos = 0;

  tiempo_entrada = {hour: this.horas, minute: this.minutos};
  tiempo_salida = {hour: this.horas, minute: this.minutos};
  meridian = true;
  tiempo_minimo = 40;

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  compararTiempos() {
    if(this.tiempo_entrada.hour > this.tiempo_salida.hour){
      this.error_horario = true;
    } else if (this.tiempo_entrada.hour == this.tiempo_salida.hour &&
      this.tiempo_entrada.minute > this.tiempo_salida.minute) {
        this.error_horario = true;
    } else if (this.tiempo_entrada.hour == this.tiempo_salida.hour &&
      this.tiempo_entrada.minute == this.tiempo_salida.minute) {
        this.error_horario = true;
    } else {
      this.periodo_minutos = (this.tiempo_salida.hour - this.tiempo_entrada.hour) * 60 +
        (this.tiempo_salida.minute - this.tiempo_entrada.minute);
      if(this.periodo_minutos < this.tiempo_minimo) {
        this.error_horario = true;
      } else {
        this.error_horario = false;
      }
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private breakpointObserver: BreakpointObserver, public router: Router,
              private registroHorarioService: RegistrarHorarioService, public dialogo: MatDialog,
              config: NgbTimepickerConfig ) {
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
    config.spinners = false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;    
  }

  ngOnInit(): void {
    this.registroHorarioService.getHorarios().subscribe({
      next: (res: any) => { 
        console.log("res ", res);
        this.dataSource = new MatTableDataSource<any>(res);
        this.horarioArray = this.dataSource.data;   
        this.refresh();
      }
    });
    console.log("array: ", this.horarioArray);
    this.dataSource = new MatTableDataSource<any>(this.horarioArray);
    this.refresh();
  }

  registrarHorario(form: NgForm) {
    if(form.invalid || this.compararTiempos()){
      return;
    } else if (!this.error_horario) {
      this.diaNewHorario = form.controls['dia'].value.slice(0, -2);
      if(form.controls['hora_entrada'].value.minute < 10){
        this.horaEntradaNewHorario = form.controls['hora_entrada'].value.hour + ':0' + form.controls['hora_entrada'].value.minute;
      }
      else{
        this.horaEntradaNewHorario = form.controls['hora_entrada'].value.hour + ':' + form.controls['hora_entrada'].value.minute;
      }

      if(form.controls['hora_salida'].value.minute < 10){
        this.horaSalidaNewHorario = form.controls['hora_salida'].value.hour + ':0' + form.controls['hora_salida'].value.minute;
      }
      else{
        this.horaSalidaNewHorario = form.controls['hora_salida'].value.hour + ':' + form.controls['hora_salida'].value.minute;
      }
      this.dataSource.data.push({dia: this.diaNewHorario, 
                                hora_entrada: this.horaEntradaNewHorario, 
                                hora_salida: this.horaSalidaNewHorario});
      this.refresh();
    }
  }
  refresh() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.dataSource.data;
  }

  removeHorario(index:number){
    this.horarioArray.splice(index, 1);
    this.refresh();
  }

  finRegistro(){
    this.registroHorarioService.updateHorarios(this.horarioArray).subscribe({
     next: (res: any) => { 
      if(res == "Updated") {
        this.dialogo
        .open(DialogoInfoComponent, {
          data: 'Horario actualizado.'
        })
        .afterClosed()
        .subscribe(() => {
          if(res.admin) {
            this.router.navigate(['/menu-principal-admin']).then(() => {
              window.location.reload();
          });
          } else {
            this.router.navigate(['/menu-principal-func']).then(() => {
              window.location.reload();
            });
          }
        });
      }
    }
    });
  }

}