import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Client} from "../../../dtos/client";
import {ClientService} from "../../../services/client.service";
import {AuthenticationService} from "../../../services/authentication.service";
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-client-overview',
  templateUrl: './client-overview.component.html',
  styleUrls: ['./client-overview.component.scss']
})
export class ClientOverviewComponent implements OnInit {

  private searchWord: string;
  private error: boolean = false;
  private errorMessage: string = '';

  private clientList: Client[];
  private filteredClientList: Client[];

  constructor(private clientService: ClientService,
              private authService: AuthenticationService,
              private router: Router,
              private toastr: ToastrService) {

    this.clientService.getAllClients().subscribe(
      (clients: Client[]) => {
        this.clientList = clients;
        this.filteredClientList = clients;
      },
      (error) => this.defaultServiceErrorHandling(error)
    );

    /*
    clientService.getClientList();
    clientService.ClientListChanged$.asObservable().subscribe((value) => {
      if (value.message === 'new data') {
        this.clientList = clientService.ClientListFiltered;
      }
    });
    */

  }

  ngOnInit() {
  }


  onAddClick() {
    this.clientService.create = true;
    this.clientService.client = null;
    this.router.navigate(['client/new']);
  }

  onInfoClick(client) {
    this.clientService.remove = false;
    this.clientService.client = client;
    this.router.navigate(['client/info']);
  }

  onEditClick(client) {
    this.clientService.create = false;
    this.clientService.client = client;
    this.router.navigate(['client/edit/' + client.id]);
  }

  public onRemoveClick(client) {
    this.clientService.remove = true;
    this.clientService.client = client;
    this.router.navigate(['client/info']);
    /*this.clientService.removeClient(this.client).subscribe(
      () => {
        // this.loadClient();
      },
      error => {
        this.defaultServiceErrorHandling(error);
      }
    );*/
  }

  clear(){
    this.searchWord = '';
    this.filteredClientList = this.clientList;
  }

  filter() {
    console.log('filter');
    let searchWord = this.searchWord.trim().toLowerCase();

    this.filteredClientList = this.clientList.filter((client) => {
      if ((client.id + '').toLowerCase().includes(searchWord) || (client.name + '').toLowerCase().includes(searchWord) || (client.address + '').toLowerCase().includes(searchWord)){
        return true;
      } else {
        return false;
      }
    });
  }

  defaultServiceErrorHandling(error: any) {
    console.log(error);
    this.error = true;
    if (error.error.message !== 'No message available') {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = error.error.error;
    }
  }
}


