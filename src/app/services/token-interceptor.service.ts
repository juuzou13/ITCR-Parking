import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private loginService: LoginService
  ) { }

  intercept(req: any, next: any) {
    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.loginService.getToken()}`
      }
    })
    return next.handle(tokenizeReq);
  }

}
