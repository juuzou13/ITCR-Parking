import { Component, OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
import { ConsultarParqueosService } from '../services/consultar-parqueos.service';
import { ConsultaFuncionarioService } from '../services/consulta-funcionario.service';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { DescargarInformesService } from '../services/descargar-informes.service';

@Component({
  selector: 'app-descarga-informes',
  templateUrl: './descarga-informes.component.html',
  styleUrls: ['./descarga-informes.component.css']
})
export class DescargaInformesComponent implements OnInit {

  items = Array.from({length: 10}).map((_, i) => `Item #${i}`);

  cols : number;

  departamentosRegistrados = [{nombre_campus: '', departamento : ''}]
  departamentoSelected = "";
  activado : any = false;

  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 2,
    xs: 1
  }
  
  constructor(private breakpointObserver: BreakpointObserver, private servicio_parqueos: ConsultarParqueosService, private servicio_funcionarios: ConsultaFuncionarioService,
    public dialogo: MatDialog, private descargarInformes : DescargarInformesService) {
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
  }

  onDescargaInformes(form: NgForm){
    if(form.invalid){
        return;
    }
  }

  activarDepartamento(campus : string) {
    this.descargarInformes.getByCampus(campus)
      .subscribe({
        complete: () => { }, 
        error: (err: any) => { 
          this.dialogo
          .open(DialogoInfoComponent, {
            data: 'Error: '+ err.error
          });
        },
        next: (res: any) => { 
          if(res.length <= 0) {
            this.dialogo
            .open(DialogoInfoComponent, {
              data: 'El campus '+campus+' no tiene departamentos'
            });
          }
          this.activado = true;
          this.departamentosRegistrados = res;
        }
      });
  }

  desactivarDepartamento() {
    this.activado = false;
    this.departamentoSelected = "";
  }

  campus_selected: String;
  campus_name = [{key: "San José", value:"Campus Tecnológico Local San José"}, {key: "Alajuela", value:"Centro Académico de Alajuela"}, {key: "Alajuela", value:"Centro Académico de Alajuela"}, {key: "Cartago", value:"Campus Tecnológico Central"}, {key: "San Carlos", value:"Campus Tecnológico Local San Carlos"}, {key: "Limón", value:"Centro Académico de Limón"}]

  descargarInformeFunc() {
    console.log(this.campus_selected + '-' + this.departamentoSelected);
    console.log("Descargando informe de funcionarios...");
    
    this.servicio_funcionarios.getAllFuncionariosDataByCampus(this.campus_selected).subscribe({
      complete: () => {},
      error: (err: any) => { 
       this.dialogo
       .open(DialogoInfoComponent, {
         data: 'Error: '+ err.error
       });
     },
     next: (res: any) => {
       console.log(res)

       const found_campus = (this.campus_name.find(element => {return element.key===this.campus_selected;}))!

       if (this.departamentoSelected == "") {
        if (res.length <= 0) {
          this.dialogo
            .open(DialogoInfoComponent, {
            data: 'No hay funcionarios registrados en este campus.'
            })
            .afterClosed()
            .subscribe(() => {});
        } else {
          genFuncPDF(found_campus.value, res);
        }
       } else {
        const result = res.filter( (func: any) => func.departamentos.find((obj: any) => obj.campus == this.campus_selected && obj.departamento == this.departamentoSelected));
        console.log("result", result);
        if (result.length <= 0) {
          this.dialogo
            .open(DialogoInfoComponent, {
            data: 'No hay funcionarios registrados en este departamento.'
            })
            .afterClosed()
            .subscribe(() => {});
        } else {
          genFuncPDF(found_campus.value, result);
        }
       }
     }
    })
    /*this.dialogo
      .open(DialogoInfoComponent, {
        data: 'El informe se ha generado exitosamente.'
      })
      .afterClosed()
      .subscribe(() => {});*/
    
  }

  descargarInformeParqueos() {
    console.log("Descargando informe de estacionamientos...");
    this.servicio_parqueos.getAll().subscribe({
      complete: () => {},
      error: (err: any) => { 
       this.dialogo
       .open(DialogoInfoComponent, {
         data: 'Error: '+ err.error
       });
     },
     next: (res: any) => {
      if (res.length <= 0) {
        this.dialogo
          .open(DialogoInfoComponent, {
          data: 'No hay parqueos registrados.'
          })
          .afterClosed()
          .subscribe(() => {});
      } else {
        genParqueosPDF('Instituto Tecnológico de Costa Rica', res);
      }
     }
    })
    this.dialogo
      .open(DialogoInfoComponent, {
        data: 'El informe se ha generado exitosamente.'
      })
      .afterClosed()
      .subscribe(() => {});
  }
}

function addInfo(doc : any, category : any, content : any, xPos : any, yPos : any) {
  doc
    .setFont(font, "bold")
    .text(30, yPos, category)
    .setFont(font, "normal")
    .setFontSize(10);

  doc.text(xPos, yPos, content);
}


function addSubTitle(doc : any, content : any, yPos : any) {
  doc
    .setFont(undefined, "bold")
    .setFontSize(12)
    .text(30, yPos, content)
    .setFont(undefined, "normal")
    .setFontSize(10);
}
const font = "helvetica"

function genParqueosPDF(campus : any, lista_parqueos : any) {
  var doc = new jsPDF.jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });

  const titlex = 10;
  const titley = 10;

  doc
    .setFont(font, "bold")
    .setFontSize(20)
    .text("Informe de los parqueos registrados", 20 + titlex, 30 + titley)
    .setFont(font, "normal");
  doc
    .setFont(font, "bold")
    .setFontSize(20)
    .text(campus, 20 + titlex, 40 + titley)
    .setFont(font, "normal");

  doc.setDrawColor(36, 74, 137);
  doc.setLineWidth(2);
  doc.line(20 + titlex, 55 + titley, 175, 55 + titley); //195

  const genTime = new Date().toLocaleTimeString(); // 11:18:48 AM

  const genDate = new Date().toLocaleDateString(); // 11/16/2015

  doc
    .setFont(font, "bold")
    .setFontSize(15)
    .text(genDate, 20 + titlex, 240 + titley)
    .setFont(font, "normal");

  doc
    .setFont(font, "bold")
    .setFontSize(15)
    .text(genTime, 20 + titlex, 250 + titley)
    .setFont(font, "normal");


  lista_parqueos.forEach((parqueo : any) => {
    doc.addPage();
    var yOffset = 30;
    var xOffset = 80;
    var ySeparation = 9;
    doc
      .setFont("bold")
      .setFontSize(17)
      .text(
        "Parqueo identificación: " + parqueo._id_parqueo,
        20,
        yOffset
      )
      .setFont(font, "normal")
      .setFontSize(10);

    yOffset += 15;

    addInfo(doc, "Tipo:", parqueo.tipo, xOffset, yOffset);

    yOffset += ySeparation;

    if (parqueo.tipo == "Subcontratado") {
      addInfo(doc, "Identificación del contrato:", parqueo.id_contrato, xOffset, yOffset);
      yOffset += ySeparation;

      addInfo(doc, "Contacto:", parqueo.contacto, xOffset, yOffset);
      yOffset += ySeparation;
    }

    addInfo(doc, "Campus:", parqueo.campus, xOffset, yOffset);

    yOffset += ySeparation;

    addInfo(doc, "Dirección:", parqueo.direccion, xOffset, yOffset);

    yOffset += ySeparation;

    addInfo(
      doc,
      "Capacidad Total:",
      parqueo.capacidad_total.toString(),
      xOffset,
      yOffset
    );

    yOffset += ySeparation;

    addInfo(
      doc,
      "Capacidad Actual:",
      parqueo.capacidad_actual.toString(),
      xOffset,
      yOffset
    );

    yOffset += ySeparation + 5;

    addSubTitle(
      doc,
      "Cantidad campos asignados",
      yOffset
    );

    yOffset += ySeparation - 5;

    var table_body : any = [];

    var row : any = [];

    row.push(parqueo.espacios_jefatura.toString());
    row.push(parqueo.espacios_VOficiales.toString());
    row.push(parqueo.espacios_asignados.toString());
    row.push(parqueo.espacios_visitantes.toString());
    row.push(parqueo.espacios_NEspeciales.toString());
    table_body.push(row);

    autoTable(doc, {
      head: [["Jefatura", "VOficiales", "Asignados TEC", "Visitantes TEC", "Nec. Especiales"]],
      body: table_body,
      startY: yOffset,
      tableWidth: "auto",
      margin: { left: 30, right: 30 },
    });

    yOffset += ySeparation + 15;

    addSubTitle(
      doc,
      "Horario del parqueo",
      yOffset
    );

    yOffset += ySeparation - 5;

    var table_body : any = [];

    var row : any = [];

    parqueo.horario.forEach((horario : any) => {
      row.push(horario.dia);
      row.push(horario.hora_entrada);
      row.push(horario.hora_salida);
      table_body.push(row);
      row = [];
    });

    autoTable(doc, {
      head: [["Día", "Hora de Entrada", "Hora de salida"]],
      body: table_body,
      startY: yOffset,
      tableWidth: "auto",
      margin: { left: 30, right: 30 },
    });
  });

  doc.save("informe_parqueos.pdf");
};

function genFuncPDF(campus:any, lista_func:any) {
  var doc = new jsPDF.jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });

  

  console.log(doc.getFontList())

  const titlex = 10;
  const titley = 10;


  doc
    .setFont(font, "bold")
    .setFontSize(20)
    .text("Informe de funcionarios del campus",20 + titlex, 30 + titley)
  doc
    .setFontSize(20)
    .text(campus, 20 + titlex, 40 + titley)
    .setFont(font, "normal");

  doc.setDrawColor(36, 74, 137);
  doc.setLineWidth(2);
  doc.line(20 + titlex, 55 + titley, 175, 55 + titley); //195

  const genTime = new Date().toLocaleTimeString(); // 11:18:48 AM

  const genDate = new Date().toLocaleDateString(); // 11/16/2015

  doc
    .setFont(font, "bold")
    .setFontSize(15)
    .text(genDate, 20 + titlex, 240 + titley)
    .setFont(font, "normal");

    doc
    .setFont(font, "bold")
    .setFontSize(15)
    .text(genTime, 20 + titlex, 250 + titley)
    .setFont(font, "normal");


  lista_func.forEach((funcionario:any) => {
    doc.addPage();
    var yOffset = 30;
    var xOffset = 80;
    var ySeparation = 9;
    doc
      .setFont(font, "bold")
      .setFontSize(17)
      .text(
        
        "Funcionario identificación " + funcionario.identificacion, 20,
        yOffset
      )
      .setFont(font, "normal")
      .setFontSize(10);

    yOffset += 15;

    addInfo(doc, "Nombre:", funcionario.nombre_completo, xOffset, yOffset);

    yOffset += ySeparation;

    addInfo(
      doc,
      "Tipo de funcionario:",
      funcionario.tipo_funcionario,
      xOffset,
      yOffset
    );

    yOffset += ySeparation;

    addInfo(
      doc,
      "Correo Insitucional:",
      funcionario.correo_institucional,
      xOffset,
      yOffset
    );

    yOffset += ySeparation;

    addInfo(
      doc,
      "Correo Personal:",
      funcionario.correo_personal,
      xOffset,
      yOffset
    );
    yOffset += ySeparation;
    addInfo(
      doc,
      "Administrativo:",
      funcionario.admin ? "Sí" : "No",
      xOffset,
      yOffset
    );
    yOffset += ySeparation;
    addInfo(
      doc,
      "Jefatura:",
      funcionario.jefatura ? "Sí" : "No",
      xOffset,
      yOffset
    );
    yOffset += ySeparation;
    addInfo(
      doc,
      "Incapacitado:",
      funcionario.incapacitado ? "Sí" : "No",
      xOffset,
      yOffset
    );

    var table_body:any = [];

    var row:any = [];

    funcionario.departamentos.forEach((departamento:any) => {
      row.push(departamento.campus);
      row.push(departamento.departamento);
      table_body.push(row);
      row = [];
    });

    autoTable(doc, {
      head: [["Campus", "Departamento"]],
      body: table_body,
      startY: 115,
      tableWidth: 75,
      margin: { left: 110 },
    });

    var table_body:any = [];

    var row:any = [];

    funcionario.placas_asociadas.forEach((placa:any) => {
      row.push("Número de placa: " + placa.codigo_placa);
      table_body.push(row);
      row = [];
    });

    autoTable(doc, {
      head: [["Placas Asociadas"]],
      body: table_body,
      startY: 115,
      tableWidth: 75,
      margin: { left: 30 },
    });

    doc.addPage();

    doc
      .setFont(font, "bold")
      .setFontSize(17)
      .text("Horarios de funcionario", 20, 30)
      .setFont(font, "normal")
      .setFontSize(10);

    var table_body:any = [];

    var row:any = [];

    funcionario.horario.forEach((horario:any) => {
      row.push(horario.dia);
      row.push(horario.hora_entrada);
      row.push(horario.hora_salida);
      table_body.push(row);
      row = [];
    });

    autoTable(doc, {
      head: [["Día", "Hora de Entrada", "Hora de salida"]],
      body: table_body,

      startY: 40,
      pageBreak: "auto", // 'auto', 'avoid' or 'always'
      tableWidth: "auto",
      margin: { left: 30, right: 30 },
    });
  });

  doc.save("informe_funcionarios.pdf");

}