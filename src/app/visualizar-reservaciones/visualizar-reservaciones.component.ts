import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from '../compartido/dialogo-info/dialogo-info.component';
import { DialogoConfirmacionComponent } from '../compartido/dialogo-confirmacion/dialogo-confirmacion.component';


@Component({
  selector: 'app-visualizar-reservaciones',
  templateUrl: './visualizar-reservaciones.component.html',
  styleUrls: ['./visualizar-reservaciones.component.css']
})
export class VisualizarReservacionesComponent implements OnInit {

  fechaS = new Date();
  cols : number | undefined;

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  busquedaOn = false;
  dias = [{dia:'Lunes', id:1}, {dia:'Martes', id:2}, 
          {dia:'Miércoles', id:3}, {dia:'Jueves', id:4}, 
          {dia:'Viernes', id:5}, {dia:'Sábado', id:6}];
  reservas = [
    {dia: 'Lunes', hora_inicio:'7:00am', hora_fin:'10:00am', tipo_parqueo:'Principal', 
    nombre:'Parqueo CTLSJ', campus:'SJ', direccion: 'Barrio Amón', id_espacio:"2"},
    {dia: 'Martes', hora_inicio:'9:00am', hora_fin:'3:00pm', tipo_parqueo:'Subcontratado', 
    nombre:'Parqueo OASIS', campus:'SJ', direccion: 'Barrio Amón, frente al TEC', id_espacio:"3"},
    {dia: 'Jueves', hora_inicio:'9:00am', hora_fin:'3:00pm', tipo_parqueo:'Subcontratado', 
    nombre:'Parqueo OASIS', campus:'SJ', direccion: 'Barrio Amón, frente al TEC', id_espacio:"4"},
  ]

  constructor( public dialogo: MatDialog ) { }

  ngOnInit(): void {
  }

  onBuscar(form: NgForm){
    if(form.invalid){
      this.busquedaOn = false;
      return;
    }
    if(form.value.diaInicio > form.value.diaFin){
      this.dialogo
      .open(DialogoInfoComponent, {
        data: 'El día de fin no debe estar después al día de inicio.'
      })
      .afterClosed()
      .subscribe(() => {
        this.busquedaOn = false;
      });
      return;
    }
    else{
      console.log(form.value);
      this.busquedaOn = true;
    }

    
  }
}
