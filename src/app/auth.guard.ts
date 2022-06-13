import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { DialogoInfoComponent } from './compartido/dialogo-info/dialogo-info.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private dialogo: MatDialog
  ) {}

  canActivate(route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean |
      UrlTree> | Promise<boolean | UrlTree> {
    return this.activatePermisos(route);
  }

  activatePermisos(route: ActivatedRouteSnapshot): boolean {
    if(this.loginService.loggedIn()) {
      if((this.loginService.getJefatura() == "0" && route.data['usuario'] == 'jefatura')
         || (this.loginService.getAdmin() == "0" && this.loginService.getJefatura() == "0"
         && route.data['usuario'] == 'admin-jefatura') || (this.loginService.getOperador() == "0"
         && route.data['usuario'] == 'operador')) {
        this.dialogo
        .open(DialogoInfoComponent, {
          data: 'Acceso único para usuario ' + route.data['usuario']
        })
        .afterClosed()
        .subscribe(() => {
          this.router.navigate(['/log-in']);
        });
        return false;
      }
      if(this.loginService.getAdmin() == "1")
        return true;
      if(this.loginService.getAdmin() == "0" &&
        (route.data['usuario'] == 'func' ||
         route.data['usuario'] == 'jefatura' ||
         route.data['usuario'] == 'admin-jefatura' ||
         route.data['usuario'] == 'operador'))
        return true;
    }
    this.dialogo
      .open(DialogoInfoComponent, {
        data: 'Acceso único para usuario ' + route.data['usuario']
      })
      .afterClosed()
      .subscribe(() => {
        this.router.navigate(['/log-in']);
      });
    return false;
  }
    
}
