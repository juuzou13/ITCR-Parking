import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReservarEspacioFuncionarioService {

  API = 'https://morning-ocean-45997.herokuapp.com/manejo_reserva';

  APIaddReserva = this.API + '/addReserva';

  constructor(private http: HttpClient, private router: Router) { }

  registrarReserva(form: any){
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(form);
    console.log(body)
    //return this.http.post(this.API, body,{'headers':headers, responseType: 'text'})

  }

  API2 = 'https://morning-ocean-45997.herokuapp.com/consulta-funcionario'

  getFuncionarioData(identificacion: string){ 
    console.log(identificacion)
    return this.http.get<any>(this.API2 + `/findByID/${identificacion}`);
  }

  API3 = 'https://morning-ocean-45997.herokuapp.com/consulta-parqueo';

  getEspaciosFrom(idParqueo: string) {
    return this.http.get<any>(this.API3 + `/get-espacios-from/${idParqueo}`);
  }

  getAllParqueos() {
    return this.http.get<any>(this.API3 + '/get-all');
  }
}
