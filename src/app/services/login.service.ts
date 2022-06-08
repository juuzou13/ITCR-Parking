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
    localStorage.removeItem('token');
    localStorage.removeItem('jefatura');
    localStorage.removeItem('id');
    localStorage.removeItem('admin');
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

}
