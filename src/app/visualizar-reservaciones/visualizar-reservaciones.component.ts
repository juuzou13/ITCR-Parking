import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { DialogoConfirmacionComponent } from '../compartido/dialogo-confirmacion/dialogo-confirmacion.component';
import { ReservarEspacioFuncionarioService } from '../services/reservar-espacio-funcionario.service';
import { Reserva } from '../modelos/reserva.model';


@Component({
  selector: 'app-visualizar-reservaciones',
  templateUrl: './visualizar-reservaciones.component.html',
  styleUrls: ['./visualizar-reservaciones.component.css']
})

export class VisualizarReservacionesComponent implements OnInit {

  fechaInicio = new Date();
  fechaFinal = new Date();
  cols : number | undefined;

  busquedaOn = false;
  reservas : any = [];

  constructor( public dialogo: MatDialog, 
    private manejoReservas: ReservarEspacioFuncionarioService) { }

  ngOnInit(): void {}

  onBuscar(){
    const fechas = {
      idPersona: localStorage.getItem('id'),
      dI: this.fechaInicio.getDate(),
      mI: this.fechaInicio.getMonth() + 1,
      aI: this.fechaInicio.getFullYear(),
      dF: this.fechaFinal.getDate(),
      mF: this.fechaFinal.getMonth() + 1,
      aF: this.fechaFinal.getFullYear()
    }
    this.manejoReservas.getBetweenDates(fechas).subscribe({
      complete: () => {},
      next: (reservas: any) => {
        const reservasParseadas = JSON.parse(reservas);
        if (reservasParseadas.length == 0) {
          this.dialogo
          .open(DialogoInfoComponent, {
            data: 'No existe ninguna reserva entre estás fechas.'
          })
          .afterClosed()
          .subscribe(() => {
          });
        } else {
          this.manejoReservas.getAllParqueos().subscribe({
            complete: () => {},
            next: async (parqueos: any) => {

              const reservasCompletas = await Promise.all(
                reservasParseadas.map( async (obj: any) => {
                  const parqueo = await parqueos.find((obj1: any) => {
                    return obj1._id == obj.idParqueo;
                  });
                  if (obj.rangoHorario.dia == "lunes") {
                    obj.rangoHorario.dia = "Lunes";
                  } else if (obj.rangoHorario.dia == "martes") {
                    obj.rangoHorario.dia = "Martes";
                  } else if (obj.rangoHorario.dia == "miercoles") {
                    obj.rangoHorario.dia = "Miércoles";
                  } else if (obj.rangoHorario.dia == "jueves") {
                    obj.rangoHorario.dia = "Jueves";
                  } else if (obj.rangoHorario.dia == "viernes") {
                    obj.rangoHorario.dia = "Viernes";
                  } else if (obj.rangoHorario.dia == "sabado") {
                    obj.rangoHorario.dia = "Sábado";
                  } else if (obj.rangoHorario.dia == "domingo") {
                    obj.rangoHorario.dia = "Domingo";
                  }
                  obj.tipo = parqueo.tipo;
                  obj.nombreParqueo = parqueo._id_parqueo;
                  obj.campus = parqueo.campus;
                  obj.direccion = parqueo.direccion;
                  return await obj;
                })
              );
              this.reservas = reservasCompletas.sort(
                (objA, objB) =>  new Date(objB.rangoHorario.anio, objB.rangoHorario.mes, objB.rangoHorario.dia_mes, objB.rangoHorario.hora_entrada.split(":")[0], objB.rangoHorario.hora_entrada.split(":")[1]).getTime() - new Date(objA.rangoHorario.anio, objA.rangoHorario.mes, objA.rangoHorario.dia_mes, objA.rangoHorario.hora_entrada.split(":")[0], objA.rangoHorario.hora_entrada.split(":")[1]).getTime(),
              );
              this.busquedaOn = true;
            }
          });
        }
      },
    });
  }
}