import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Funcionario } from '../modelos/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasFHService {

  constructor(private http: HttpClient, private router: Router) {}

  API = 'https://morning-ocean-45997.herokuapp.com/consulta-funcionario'

  getFuncionarioAdmData(campus: String){ 
    console.log(campus)
    return this.http.get<any>(this.API + `/get-horariosAdm/${campus}`);
  }

  getFuncionarioDocData(campus: String){ 
    console.log(campus)
    return this.http.get<any>(this.API + `/get-horariosDoc/${campus}`);
  }

  getFuncionarioAmbosData(campus: String){ 
    console.log(campus)
    return this.http.get<any>(this.API + `/get-horariosAmb/${campus}`);
  }

  

}
