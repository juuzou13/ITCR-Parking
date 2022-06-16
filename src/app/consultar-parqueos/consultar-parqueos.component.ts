import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgForm, FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { ConsultarParqueosService } from '../services/consultar-parqueos.service';
import {Parqueo} from '../modelos/parqueo.model';
import {Campus} from '../modelos/campus.model';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { DialogoConfirmacionComponent } from '../compartido/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-consultar-parqueos',
  templateUrl: './consultar-parqueos.component.html',
  styleUrls: ['./consultar-parqueos.component.css']
})
export class ConsultarParqueosComponent implements OnInit {

  newParqueo: any = {
    _id: '',
    _id_parqueo: '',
    tipo: '',
    capacidad_total: 0,
    capacidad_actual: 0,
    horario: [],
    espacios: [],
    campus: '',
    espacios_jefatura: 0,
    espacios_VOficiales: 0,
    espacios_asignados: 0,
    espacios_visitantes: 0,
    espacios_NEspeciales: 0,
    direccion: '',
    contacto: '',
    id_contrato: ''
  }

  espacios_parqueo = Array<any>();
  horaEntradaNewHorario:String = "";
  horaSalidaNewHorario:String = "";

  admin = parseInt(localStorage.getItem('admin') || "");

  consulta_func = false;
  subcontratado = false;
  consulta_admin = false;
  sin_edicion = true;
  fecha = new Date();
  horas = this.fecha.getHours();
  minutos = this.fecha.getMinutes();
  error_horario = false;
  error_horario_2 = false;
  periodo_minutos = 0;
  cantParqueos = 0;
  consultaEnCurso = false;
  Campus = ["Cartago", "San José", "San Carlos", "Alajuela", "Limón"];
  selected = "";
  dias_de_semana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  tiempo_entrada = {hour: this.horas, minute: this.minutos};
  tiempo_salida = {hour: this.horas, minute: this.minutos};
  meridian = true;
  tiempo_minimo = 40;


  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  parqueoSeleccionado : any = [];
  parqueosRegistrados : any = [];

  consultarParqueo(){
    if(this.parqueoSeleccionado.tipo == "Principal") {
      this.activarParqueo(1);
    } else {
      this.activarParqueo(2);
    }
    this.consultaEnCurso = true;
    this.dataSource = new MatTableDataSource<any>(this.parqueoSeleccionado.horario);
    this.dataSource.paginator = this.paginatorHorario;
    console.log("dataSource", this.dataSource);
    this.cantParqueos = this.parqueoSeleccionado.horario.length;
    this.selected = this.parqueoSeleccionado.campus;
  }

  cols : number | undefined;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }
  
  constructor(private breakpointObserver: BreakpointObserver, config: NgbTimepickerConfig,
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
    config.spinners = false;
  }

  compararTiempos() {
    if(this.tiempo_entrada.hour > this.tiempo_salida.hour){
      this.error_horario = true;
      this.error_horario_2 = false;
    } else if (this.tiempo_entrada.hour == this.tiempo_salida.hour &&
      this.tiempo_entrada.minute > this.tiempo_salida.minute) {
        this.error_horario = true;
        this.error_horario_2 = false;
    } else if (this.tiempo_entrada.hour == this.tiempo_salida.hour &&
      this.tiempo_entrada.minute == this.tiempo_salida.minute) {
        this.error_horario = true;
        this.error_horario_2 = false;
    } else {
      this.periodo_minutos = (this.tiempo_salida.hour - this.tiempo_entrada.hour) * 60 +
        (this.tiempo_salida.minute - this.tiempo_entrada.minute);
      if(this.periodo_minutos < this.tiempo_minimo) {
        this.error_horario_2 = true;
        this.error_horario = false;
      } else {
        this.error_horario_2 = false;
        this.error_horario = false;
      }
    }
  }

  displayedColumns: string[] = ['Dia','Entrada','Salida','Eliminar'];
  dataSource : any;

  @ViewChild(MatPaginator) paginatorHorario: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorHorario;
  }

  ngOnInit(): void {
     this.servicio_parqueos.getAll().subscribe({
       complete: () => {},
       error: (err: any) => { 
        this.dialogo
        .open(DialogoInfoComponent, {
          data: 'Error: '+ err.error
        });
      },
      next: (res: any) => {
        
        this.parqueosRegistrados = res;
      }
     })
  }

  departamentos : any = ["Física", "Computación", "Arquitectura", "Matemática", "Cultura y Deporte"];

  async onEditarParqueo(form: NgForm){
    const capacidad_adicional = form.value.espacios_jefatura + 
    form.value.espacios_VOficiales + form.value.espacios_visitantes +
    form.value.espacios_NEspeciales;
    const asignados_tec = form.value.capacidad_total - capacidad_adicional;

    console.log("capacidad_adicional", capacidad_adicional);
    console.log("asignados_tec", asignados_tec);
    if(form.invalid){
        return;
    } else if(this.dataSource.data.length == 0) {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: La lista de horarios está vacía'
      });
      return
    } else if(capacidad_adicional > form.value.capacidad_total) {
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Error: La suma de espacios es mayor a la capacidad total'
      });
      return
    }

    console.log("form", form);

    this.newParqueo._id = this.parqueoSeleccionado._id;
    this.newParqueo._id_parqueo = form.value._id_parqueo
    this.newParqueo.tipo = this.parqueoSeleccionado.tipo;
    this.newParqueo.capacidad_total = form.value.capacidad_total;
    this.newParqueo.capacidad_actual = form.value.capacidad_total;
    this.newParqueo.campus = this.selected;
    this.newParqueo.espacios_jefatura = form.value.espacios_jefatura;
    this.newParqueo.espacios_VOficiales = form.value.espacios_VOficiales;
    this.newParqueo.espacios_asignados = asignados_tec;
    this.newParqueo.espacios_visitantes = form.value.espacios_visitantes;
    this.newParqueo.espacios_NEspeciales = form.value.espacios_NEspeciales;
    this.newParqueo.direccion = form.value.direccion;
    this.newParqueo.horario = this.dataSource.data;

    if(this.subcontratado) {
      this.newParqueo.contacto = form.value.contacto;
      this.newParqueo.id_contrato = form.value.id_contrato;
    } else {
      this.newParqueo.contacto = '';
      this.newParqueo.id_contrato = '';
    }

    // for (let index = 0; index < asignados_tec; index++) {
    //   this.espacios_parqueo.push({_id: "", tipo: "COMUN", ocupado: `${Math.floor(Math.random() * 2)}`, departamentoFuncionario: `${this.departamentos[Math.floor(Math.random() * this.departamentos.length)]}`});
    // }
    // for (let index = 0; index < form.value.espacios_NEspeciales; index++) {
    //   this.espacios_parqueo.push({_id: "", tipo: "ESPECIAL", ocupado: `${Math.floor(Math.random() * 2)}`, departamentoFuncionario: `${this.departamentos[Math.floor(Math.random() * this.departamentos.length)]}`});
    // }
    // for (let index = 0; index < form.value.espacios_jefatura; index++) {
    //   this.espacios_parqueo.push({_id: "", tipo: "JEFATURA", ocupado: `${Math.floor(Math.random() * 2)}`, departamentoFuncionario: `${this.departamentos[Math.floor(Math.random() * this.departamentos.length)]}`});
    // }
    // for (let index = 0; index < form.value.espacios_VOficiales; index++) {
    //   this.espacios_parqueo.push({_id: "", tipo: "OFICIAL", ocupado: `${Math.floor(Math.random() * 2)}`, departamentoFuncionario: `${this.departamentos[Math.floor(Math.random() * this.departamentos.length)]}`});
    // }
    // for (let index = 0; index < form.value.espacios_visitantes; index++) {
    //   this.espacios_parqueo.push({_id: "", tipo: "VISITANTE", ocupado: `${Math.floor(Math.random() * 2)}`, departamentoFuncionario: `${this.departamentos[Math.floor(Math.random() * this.departamentos.length)]}`});
    // }

    for (let index = 0; index < asignados_tec; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "COMUN", ocupado: "0", departamentoFuncionario: ""});
    }
    for (let index = 0; index < form.value.espacios_NEspeciales; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "ESPECIAL", ocupado: "0", departamentoFuncionario: ""});
    }
    for (let index = 0; index < form.value.espacios_jefatura; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "JEFATURA", ocupado: "0", departamentoFuncionario: ""});
    }
    for (let index = 0; index < form.value.espacios_VOficiales; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "OFICIAL", ocupado: "0", departamentoFuncionario: ""});
    }
    for (let index = 0; index < form.value.espacios_visitantes; index++) {
      this.espacios_parqueo.push({_id: "", tipo: "VISITANTE", ocupado: "0", departamentoFuncionario: ""});
    }

    var indice = 0;
    for(let k in this.espacios_parqueo) { 
      this.espacios_parqueo[k]._id = `${indice}`;
      indice++;
    }

    this.newParqueo.espacios = this.espacios_parqueo;
    // this.newParqueo.espacios = this.parqueoSeleccionado.espacios;

    console.log("newParqueo", this.newParqueo);

    this.servicio_parqueos.updateByID(this.newParqueo).subscribe({
      complete: () => {},
      error: (err: any) => {},
      next: (res: any) => {}
    })

    this.dialogo
      .open(DialogoInfoComponent, {
        data: 'El parqueo se ha editado exitosamente.'
      })
      .afterClosed()
      .subscribe(() => {
        this.ngOnInit();
        this.desactivarParqueo();
        this.espacios_parqueo = [];
        form.reset();
      });
  }

  activarParqueo(tipo_parqueo: Number) {
    this.sin_edicion = true;
    this.consulta_func = true;
    if(this.admin == 0){
      this.consulta_admin = false;
    } else {
      this.consulta_admin = true;
    }
    if(tipo_parqueo == 1) {
      this.subcontratado = false;
    } else if(tipo_parqueo == 2) {
      this.subcontratado = true;
    } else {
      this.consulta_func = false;
      this.consulta_admin = false;
      this.subcontratado = false;
      this.consultaEnCurso = false;
    }
  }

  desactivarParqueo() {
    this.sin_edicion = true;
    this.consulta_func = false;
    this.consulta_admin = false;
    this.subcontratado = false;
  }

  habilitarEdicion() {
    if (this.sin_edicion) {
      this.sin_edicion = false;
    } else {
      this.sin_edicion = true;
    }
  }

  registrarHorario(form: NgForm) {
    if(form.invalid || this.compararTiempos()){
      return;
    } else if (!this.error_horario && !this.error_horario_2) {
      if(form.controls['hora_entrada'].value.minute < 10){
        this.horaEntradaNewHorario = form.controls['hora_entrada'].value.hour + ':0' + form.controls['hora_entrada'].value.minute;
      } else{
        this.horaEntradaNewHorario = form.controls['hora_entrada'].value.hour + ':' + form.controls['hora_entrada'].value.minute;
      }

      if(form.controls['hora_salida'].value.minute < 10){
        this.horaSalidaNewHorario = form.controls['hora_salida'].value.hour + ':0' + form.controls['hora_salida'].value.minute;
      } else{
        this.horaSalidaNewHorario = form.controls['hora_salida'].value.hour + ':' + form.controls['hora_salida'].value.minute;
      }
      this.dataSource.data.push({dia: this.dias_de_semana[form.controls['dia_semana'].value], hora_entrada: this.horaEntradaNewHorario, hora_salida: this.horaSalidaNewHorario});
      this.dataSource.paginator = this.paginatorHorario;
      this.refresh();

      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'El horario se ha registrado exitosamente.'
      })
      .afterClosed()
      .subscribe(() => {
        form.resetForm();
        this.tiempo_entrada = {hour: this.horas, minute: this.minutos};
        this.tiempo_salida = {hour: this.horas, minute: this.minutos};
      });
    }
  }

  eliminarParqueo(form: NgForm) {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: '¿Está seguro de eliminar parqueo?'
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.servicio_parqueos.deleteByID(this.parqueoSeleccionado._id).subscribe({
            complete: () => {},
            error: (err: any) => {},
            next: (res: any) => {}
          })
          this.dialogo
          .open(DialogoInfoComponent, {
            data: 'El parqueo se ha eliminado exitosamente.'
          })
          .afterClosed()
          .subscribe(() => {
            this.consulta_func = false;
            this.consulta_admin = false;
            this.subcontratado = false;
            this.consultaEnCurso = false;
            this.ngOnInit();
          });
        }
      });
  }
  

  onEliminarExtracto(index: number) {
    this.dataSource.data.splice(index, 1);
    this.refresh();
  }

  refresh() {
    this.dataSource.data = this.dataSource.data;
  }

}
