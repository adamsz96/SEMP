import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";
import {Employee} from "../dtos/employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) { }
  private currentUser:Employee;

  async canActivate(): Promise<boolean> {
    console.log("employee gurad activated");
    if (this.authenticationService.getUserRole() === 'EMPLOYEE') {
      console.log("currentUser: "+this.currentUser);
      await this.setCurrentUser();
      console.log("currentUser: "+this.currentUser +" username:"+this.currentUser.name+" id: "+this.currentUser.id);
      this.router.navigate(['/user-calendar/'+this.currentUser.id]);
      return false;
    } else {
      return true;
    }
  }

 async setCurrentUser(){
   this.currentUser=<Employee>await this.authenticationService.getCurrentUser();
  }
}
