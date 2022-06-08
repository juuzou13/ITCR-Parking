import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegistrarParqueoService {

  constructor(private http: HttpClient, private router: Router) {}

  API = 'https://morning-ocean-45997.herokuapp.com/registrar/parqueo/'

  addParqueo(parqueo: any){ 
    return this.http.post(this.API, parqueo, {responseType: 'text'});
  }
}
