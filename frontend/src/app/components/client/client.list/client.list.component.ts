import { Component, OnInit } from '@angular/core';
import {Client} from '../../../dtos/client';
import {ClientService} from '../../../services/client.service';
import {AuthenticationService} from '../../../services/authentication.service';
import { Router } from '@angular/router';
import {Address} from "../../../dtos/address";


@Component({
  selector: 'app-clientlist',
  templateUrl: './client.list.component.html',
  styleUrls: ['./client.list.component.scss']
})
export class ClientListComponent implements OnInit {

  public clientList: Client[] = [
    {id: 1, name: 'init', address: 'init', infos: 'ccc', phoneNumbers: 'ddd', emails: 'eee', contactPersons: 'fff'}
  ]

  constructor(private clientService: ClientService,
    private authService: AuthenticationService,
    private router: Router) {
      clientService.getClientList();
      clientService.ClientListChanged$.asObservable().subscribe((value) => {
        if (value.message === 'new data') {
          this.clientList = clientService.ClientListFiltered;
        }
      });
    }

  ngOnInit() { }
  
  onAddClick()
  {
    this.clientService.create = true;
    this.clientService.client = null;
    this.router.navigate(['client/new']);
  }
}
