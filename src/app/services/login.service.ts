import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) {}

  API = 'https://morning-ocean-45997.herokuapp.com/log-in/retrieve-credentials'

  getCredentials(form: NgForm){ 
    return this.http.get<any>(this.API + `/${form.value.usuario}` + `/${form.value.contrasenia}`);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    if(localStorage.getItem('jefatura') == "1"){
      localStorage.removeItem('campus_jefatura');
      localStorage.removeItem('dpto_jefatura');
    }
    if(localStorage.getItem('operador') == "1"){
      localStorage.removeItem('idParqueoOperador');
    }
    localStorage.removeItem('nombre_completo');
    localStorage.removeItem('token');
    localStorage.removeItem('jefatura');
    localStorage.removeItem('id');
    localStorage.removeItem('admin');
    localStorage.removeItem('operador');
    this.router.navigate(['/log-in']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getId() {
    return localStorage.getItem('id');
  }

  getAdmin() {
    return localStorage.getItem('admin');
  }

  getJefatura() {
    return localStorage.getItem('jefatura');
  }

  getOperador() {
    return localStorage.getItem('operador');
  }

}
