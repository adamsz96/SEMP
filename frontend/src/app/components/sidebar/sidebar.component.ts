import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  isAdmin() {
    return this.authenticationService.getUserRole() === "ADMIN";
  }

  isManager() {
    return this.authenticationService.getUserRole() === "MANAGER";
  }

  isEmployee() {
    return this.authenticationService.getUserRole() === "EMPLOYEE";
  }
}
