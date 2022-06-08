import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Funcionario } from '../modelos/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroFuncionarioService {

  API = 'https://morning-ocean-45997.herokuapp.com/registrar/funcionario/';

  APIgetById = 'https://morning-ocean-45997.herokuapp.com/consulta-funcionario/findByID';
  APIgetByCorreo = 'https://morning-ocean-45997.herokuapp.com/consulta-funcionario/findByCorreo';

  constructor(private http: HttpClient, private router: Router) {}

  registrarFuncionario(form: Funcionario){
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(form);
    console.log(body)
    return this.http.post(this.API, body,{'headers':headers, responseType: 'text'})

  }

  getFuncionarioById(cedula_funcionario:string){
    return this.http.get<any>(this.APIgetById + `/${cedula_funcionario}`);
  }

  getFuncionarioByCorreo(correo_institucional:string){
    return this.http.get<any>(this.APIgetByCorreo + `/${correo_institucional}`);
  }

  APIdptos = 'https://morning-ocean-45997.herokuapp.com/campus-departamentos/getAll';
  
  getDepartamentos(){
    return this.http.get<any>(this.APIdptos);
  }
}
