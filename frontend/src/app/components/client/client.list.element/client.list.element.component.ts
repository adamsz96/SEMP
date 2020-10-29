import { Component, OnInit, Input } from '@angular/core';
import { Client } from '../../../dtos/client';
import {ClientService} from '../../../services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientlistelement',
  templateUrl: './client.list.element.component.html',
  styleUrls: ['./client.list.element.component.scss']
})
export class ClientListElementComponent implements OnInit {
  @Input('client') client:Client;
  public open: boolean;

  error: boolean = false;
  errorMessage: string = '';

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit() {
  }

  onOptionsClick(){
    this.open = !this.open;
  }

  onInfoClick(){
    this.clientService.remove = false;
    this.clientService.client = this.client;
    this.router.navigate(['client/info']);
  }

  onEditClick()
  {
    this.clientService.create = false;
    this.clientService.client = this.client;
    this.router.navigate(['client/edit/' + this.client.id]);
  }

  public onRemoveClick() {
    this.clientService.remove = true;
    this.clientService.client = this.client;
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

  private defaultServiceErrorHandling(error: any) {
    console.log(error);
    this.error = true;
    if (error.error.message !== 'No message available') {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = error.error.error;
    }
  }
}
