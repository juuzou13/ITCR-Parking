import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { Funcionario } from '../modelos/funcionario.model';
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../compartido/dialogo-confirmacion/dialogo-confirmacion.component';
import { ConsultaFuncionarioService } from '../services/consulta-funcionario.service';

@Component({
  selector: 'app-consultar-funcionario',
  templateUrl: './consultar-funcionario.component.html',
  styleUrls: ['./consultar-funcionario.component.css'],
})
export class ConsultarFuncionarioComponent implements OnInit, AfterViewInit {
  funcionarioEmpty: Funcionario = {
    id: 0,
    identificacion: '',
    nombre_completo: '',
    contrasenna: '',
    celular: '',
    horario: [
      {
        dia: '',
        hora_entrada: '',
        hora_salida: '',
      },
      {
        dia: 'lunes',
        hora_entrada: '',
        hora_salida: '',
      },
    ],
    correo_institucional: '',
    departamentos: [{ campus: '', departamento: '' }],
    tipo_funcionario: '',
    placas_asociadas: [
      {
        codigo_placa: '',
      },
    ],
    admin: 0,
    jefatura: 0,
    correo_personal: '',
    campus_departamento_jefatura: { nombre_campus: '', departamento: '' },
    incapacitado: 0,
    idParqueoOperador: "",
  };

  newFuncionario: any = {
    identificacion: '',
    nombre_completo: '',
    contrasenna: '',
    celular: '',
    horario: [
      {
        dia: '',
        hora_entrada: '',
        hora_salida: '',
      },
      {
        dia: 'lunes',
        hora_entrada: '',
        hora_salida: '',
      },
    ],
    correo_institucional: '',
    departamentos: [{ campus: '', departamento: '' }],
    tipo_funcionario: '',
    placas_asociadas: [
      {
        codigo_placa: '',
      },
    ],
    admin: 0,
    jefatura: 0,
    correo_personal: '',
    campus_departamento_jefatura: { campus: '', departamento: '' },
    incapacitado: 0,
    idParqueoOperador: "",
  };

  funcionario: Funcionario = this.funcionarioEmpty;

  arrayIncapacitado = [
    { key: 0, value: 'No' },
    { key: 1, value: 'Si' },
  ];
  arrayJefatura = [
    { key: 0, value: 'No' },
    { key: 1, value: 'Si' },
  ];

  sin_jefatura = true;

  consulta_func = localStorage.getItem('admin') == '1' ? false : true;
  consulta_admin = localStorage.getItem('admin') == '1' ? true : false;
  editarFunc = this.route.snapshot.paramMap.get('editarFunc') == null ? false : true;

  sin_edicion = true;
  consultaEnCurso = false;
  hide = true;

  cols: number;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1,
  };
  tipoFuncionarioConsultado = 0;
  opcionIncapacitadoConsultado = 0;
  opcionJefaturaConsultado = 0;
  departamentos_registrados: any = [];

  tiposFuncionario = ['Docente', 'Administrador'];

  jefaturaSelected = "";
  incapacitadoSelected = "";
  tipoFuncionarioSelected = "";
  dptoSelected = "";

  departamentos = [];
  vehiculos = [];

  horarioArray = [];

  displayedColumns: string[] = ['Departamento', 'Campus'];
  dataSource = new MatTableDataSource<any>(this.departamentos);

  horarioColumns: string[] = ['dia', 'entrada', 'salida'];
  horarioSource = new MatTableDataSource<any>(this.horarioArray);

  vehiculoColumns: string[] = ['vehiculo'];
  vehiculoSource = new MatTableDataSource<any>(this.vehiculos);

  @ViewChild('paginatorH') paginatorH: MatPaginator;
  @ViewChild('paginatorD') paginatorD: MatPaginator;
  @ViewChild('paginatorV') paginatorV: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    public route: ActivatedRoute,
    private servicio_consulta_func: ConsultaFuncionarioService,
    public dialogo: MatDialog
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorD;
    //this.dataSource.paginator = this.paginatorD.toArray()[0];

    this.horarioSource.paginator = this.paginatorH;

    this.vehiculoSource.paginator = this.paginatorV;
    //this.vehiculoSource.sort = this.sort;
  }

  ngOnInit(): void {
    console.log('editarPerf', this.editarFunc);
    console.log('editarFunc', this.sin_edicion);
    if (this.editarFunc) {
      this.servicio_consulta_func.getFuncionarioData((localStorage.getItem('id') || "")).subscribe({
        complete: () => {},
        next: (res: any) => {
            console.log('editar_func: func:', res);
            this.jefaturaSelected = res.jefatura == 1 ? "Si": "No";
            console.log(" jefatur Selected en buscar ", this.jefaturaSelected);
            this.incapacitadoSelected = res.incapacitado == 1 ? "Si": "No";
            this.tipoFuncionarioSelected = res.admin == 1 ? "Administrador": "Docente";
            if(res.jefatura){
              this.dptoSelected = res.campus_departamento_jefatura.campus + "-" + res.campus_departamento_jefatura.departamento;
              this.funcionario.campus_departamento_jefatura = {nombre_campus: res.campus_departamento_jefatura.campus, 
                departamento: res.campus_departamento_jefatura.departamento};
            } else{
              this.dptoSelected = "";
            }
            this.consultaEnCurso = true;
            this.funcionario.nombre_completo = res.nombre_completo;
            this.funcionario.contrasenna = res.contrasenna;
            this.funcionario.identificacion = res.identificacion;
            this.funcionario.celular = res.celular;
            this.funcionario.correo_institucional = res.correo_institucional;
            this.funcionario.correo_personal = res.correo_personal;
            this.funcionario.incapacitado = res.incapacitado;
            this.funcionario.tipo_funcionario = res.tipo_funcionario;
            this.funcionario.jefatura = res.jefatura;
            
            this.funcionario.admin = res.admin;
            this.dataSource = new MatTableDataSource<any>(res.departamentos);
            this.departamentos = res.departamentos;
            this.funcionario.departamentos = res.departamentos;
            this.horarioSource = new MatTableDataSource<any>(res.horario);
            this.horarioArray = res.horario;
            this.funcionario.horario = res.horario;
            this.vehiculoSource = new MatTableDataSource<any>(res.placas_asociadas);
            this.vehiculoSource = res.placas_asociadas;
            this.vehiculos = res.placas_asociadas;
            this.funcionario.placas_asociadas = res.placas_asociadas;
            this.tipoFuncionarioConsultado = this.tiposFuncionario.findIndex(
              (element) => element === res.tipo_funcionario
            );

          this.consultaEnCurso = true;
          this.sin_edicion = false;
        }
      })
    }
    this.servicio_consulta_func.getDepartamentos()
    .subscribe({
      complete: () => {},
      next: (res: any) => {
          this.departamentos_registrados = res;
    }});
  }

  consultarFuncionario(identificacion: any) {
    this.sin_edicion = true;
    //this.sin_jefatura = true;
    if (identificacion.invalid) {
      this.consultaEnCurso = false;
      this.consulta_admin = false;
      this.consulta_func = false;
      return;
    } else {
      this.servicio_consulta_func.getFuncionarioData(identificacion.value).subscribe({
        complete: () => {},

        next: (res: any) => {
          if (!res) {
            this.dialogo
              .open(DialogoInfoComponent, {
                data: 'El funcionario ingresado no existe.',
              })
              .afterClosed()
              .subscribe(() => {
                this.consultaEnCurso = false;
                this.funcionario = this.funcionarioEmpty;
              });
          } else {
        
            this.jefaturaSelected = res.jefatura == 1 ? "Si": "No";
            console.log(" jefatur Selected en buscar ", this.jefaturaSelected);
            this.incapacitadoSelected = res.incapacitado == 1 ? "Si": "No";
            this.tipoFuncionarioSelected = res.admin == 1 ? "Administrador": "Docente";
            if(res.jefatura){
              this.dptoSelected = res.campus_departamento_jefatura.campus + "-" + res.campus_departamento_jefatura.departamento;
              this.funcionario.campus_departamento_jefatura = {nombre_campus: res.campus_departamento_jefatura.campus, 
                departamento: res.campus_departamento_jefatura.departamento};
            } else{
              this.dptoSelected = "";
            }
            this.consultaEnCurso = true;
            this.funcionario.nombre_completo = res.nombre_completo;
            this.funcionario.contrasenna = res.contrasenna;
            this.funcionario.identificacion = res.identificacion;
            this.funcionario.celular = res.celular;
            this.funcionario.correo_institucional = res.correo_institucional;
            this.funcionario.correo_personal = res.correo_personal;
            this.funcionario.incapacitado = res.incapacitado;
            this.funcionario.tipo_funcionario = res.tipo_funcionario;
            this.funcionario.jefatura = res.jefatura;
            
            
            this.funcionario.admin = res.admin;
            this.dataSource = new MatTableDataSource<any>(res.departamentos);
            this.departamentos = res.departamentos;
            this.funcionario.departamentos = res.departamentos;
            this.horarioSource = new MatTableDataSource<any>(res.horario);
            this.horarioArray = res.horario;
            this.funcionario.horario = res.horario;
            this.vehiculoSource = new MatTableDataSource<any>(res.placas_asociadas);
            //this.vehiculoSource = res.placas_asociadas;
            this.vehiculos = res.placas_asociadas;
            this.funcionario.placas_asociadas = res.placas_asociadas;
            this.tipoFuncionarioConsultado = this.tiposFuncionario.findIndex(
              (element) => element === res.tipo_funcionario
            );
            console.log(res);
            this.dataSource.paginator = this.paginatorD;
            this.vehiculoSource.paginator = this.paginatorV;
            this.horarioSource.paginator = this.paginatorH;
          }
        },
      });
    }
  }

  onEditarFuncionario(form: NgForm) {
    if (form.invalid) {
      this.dialogo
              .open(DialogoInfoComponent, {
                data: 'No se pudo editar el funcionario, por favor revise los campos.',
              })
      return;
    }else{
      if (this.editarFunc) {

        this.newFuncionario.nombre_completo = this.funcionario.nombre_completo;
        this.newFuncionario.contrasenna = form.value.contrasenna;
        this.newFuncionario.identificacion = this.funcionario.identificacion;
        this.newFuncionario.celular = form.value.telefono;
        this.newFuncionario.correo_institucional = this.funcionario.correo_institucional;
        this.newFuncionario.correo_personal = form.value.correoP;
        this.newFuncionario.tipo_funcionario = this.funcionario.tipo_funcionario;
      
        this.newFuncionario.admin = this.tipoFuncionarioSelected=="Docente"? 0: 1;
        this.newFuncionario.departamentos = this.funcionario.departamentos;
        this.newFuncionario.horario = this.funcionario.horario;
        this.newFuncionario.placas_asociadas = this.funcionario.placas_asociadas;
        this.newFuncionario.campus_departamento_jefatura = {campus: this.funcionario.campus_departamento_jefatura.nombre_campus,
          departamento: this.funcionario.campus_departamento_jefatura.departamento};

        this.newFuncionario.incapacitado = this.incapacitadoSelected=="Si"? 1: 0;
        this.newFuncionario.jefatura = this.jefaturaSelected=="Si"? 1: 0;
        

        this.servicio_consulta_func
        .updateFuncionarioData(this.newFuncionario)
        .subscribe({
          complete: () => {},
          error: (err: any) => {
            this.dialogo
            .open(DialogoInfoComponent, {
              data: 'El perfil se ha editado exitosamente.'
            })
            .afterClosed()
            .subscribe(() => {
              this.router.navigate([this.consulta_admin ? '/menu-principal-admin' : '/menu-principal-func']);
            });
          },
          next: (res: any) => {},
        });
      } else {
        console.log(" jefatur Selected ", this.jefaturaSelected);
        console.log("form", form);
        this.newFuncionario.nombre_completo = form.value.nombre;
        this.newFuncionario.contrasenna = this.funcionario.contrasenna;
        this.newFuncionario.identificacion = form.value.identificacion;
        this.newFuncionario.celular = form.value.telefono;
        this.newFuncionario.correo_institucional = form.value.correoI;
        this.newFuncionario.correo_personal = form.value.correoP;
        this.newFuncionario.tipo_funcionario = form.value.tipoF;
      
        this.newFuncionario.admin = this.tipoFuncionarioSelected=="Docente"? 0: 1;

        this.newFuncionario.departamentos = this.funcionario.departamentos;
        this.newFuncionario.horario = this.funcionario.horario;
        this.newFuncionario.placas_asociadas = this.funcionario.placas_asociadas;
        console.log(this.dptoSelected);
        console.log(this.jefaturaSelected);
        if(this.jefaturaSelected == "Si"){
          const myArray = form.value.dptoJefatura.split("-");
          this.newFuncionario.campus_departamento_jefatura = {campus:myArray[0], 
            departamento:myArray[1]};
        } else{
          this.sin_jefatura = true;
          this.newFuncionario.campus_departamento_jefatura = {campus:"", 
            departamento:""};
        }
        
        this.newFuncionario.incapacitado = this.incapacitadoSelected=="Si"? 1: 0;
        this.newFuncionario.jefatura = this.jefaturaSelected=="Si"? 1: 0;
        console.log("New Func", this.newFuncionario);
        
        this.servicio_consulta_func
        .updateFuncionarioData(this.newFuncionario)
        .subscribe({
          complete: () => {},

          next: (res: any) => {
            console.log("ready")
            console.log(res);
            console.log("ready")
          },
        });
        this.dialogo
        .open(DialogoInfoComponent, {
          data: 'El funcionario se ha editado exitosamente.'
        })
        .afterClosed()
        .subscribe(() => {
          this.ngOnInit();
          form.reset();
          this.sin_edicion = true;
          this.consultaEnCurso = false;
          this.sin_jefatura = true;
        });
      }
    }
  }

  habilitarEdicion() {
    if (this.sin_edicion) {
      this.sin_edicion = false;
      if(this.jefaturaSelected == "Si"){
        this.sin_jefatura = false;
      }
      else{
        this.sin_jefatura = true;
      }
    } else {
      this.sin_edicion = true;
      this.sin_jefatura = true;
    }
  }

  eliminarFuncionario(form: NgForm) {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: '¿Está seguro que desea eliminar este funcionario?',
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        
        
        
        if (confirmado) {
          this.servicio_consulta_func.deleteFuncionarioData(form.value.identificacion).subscribe({
            complete: () => {},
            next: (res: any) => {
              console.log(res)
            }
          })
          this.dialogo
            .open(DialogoInfoComponent, {
              data: 'El funcionario se ha eliminado exitosamente.',
            })
            .afterClosed()
            .subscribe(() => {
              this.sin_edicion = true;
              this.consultaEnCurso = false;
              this.sin_jefatura = true;
            });
        }
      });
  }

  checkJefatura(jefatura: any){
    if(jefatura == "Si"){
      this.sin_jefatura = false;
    } else if( jefatura == "No"){
      this.sin_jefatura = true;
    }
  }
}
