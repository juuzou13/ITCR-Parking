import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DescargarInformesService {

  constructor(private http: HttpClient, private router: Router) {}

  API = 'https://morning-ocean-45997.herokuapp.com/campus-departamentos';

  getByCampus(campus : string) {
    return this.http.get<any>(this.API + '/getByCampus' + `/${campus}`);
  }
}
