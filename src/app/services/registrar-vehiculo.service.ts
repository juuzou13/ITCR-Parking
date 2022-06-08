import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegistrarVehiculoService {

  constructor(private http: HttpClient, private router: Router) {}

  API = 'https://morning-ocean-45997.herokuapp.com/registrar-vehiculo'

  getVehiculos(){ 
    return this.http.get<any>(this.API + '/get-vehiculos/id');
  }

  updateVehiculos(placas_asociadas: any) {
    return this.http.put(this.API + '/update-vehiculos', placas_asociadas, {responseType: 'text'});
  }

}
