import { CanActivate, RouterStateSnapshot,ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService,private router: Router){}

  /*
  In this class we are protecting our routes from unauthorized users to
  restrict their access to these protective routes so as to prevent them to
  do some actions that they are not allowed to do such as creating new posts,
  editing and deleting posts without authentication.
  */

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth =  this.authService.getIsAuth();
    if(!isAuth){
      this.router.navigate(['/auth/login']);
    }
    return isAuth;
  }
}
