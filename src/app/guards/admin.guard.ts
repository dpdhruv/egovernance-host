import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private user:AuthService,private router:Router){}
  guardAdminValue:boolean;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean {
    if(this.user.isValidAdmin == true){
      return true;
    }else{
      this.router.navigate(['']);
      this.guardAdminValue=true;
      return false;
    }
  }
}
