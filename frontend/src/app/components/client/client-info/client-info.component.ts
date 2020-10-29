import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Client} from '../../../dtos/client';
import {ClientService} from '../../../services/client.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import {AuthenticationService} from '../../../services/authentication.service';
import { Router } from '@angular/router';
import {Location} from "@angular/common";

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent implements OnInit {

  public client: Client;
  public remove: boolean;

  error: boolean = false;
  errorMessage: string = '';

  constructor(private clientService: ClientService, private ngbPaginationConfig: NgbPaginationConfig,
    private cd: ChangeDetectorRef, private authService: AuthenticationService, private router: Router,
              private _location: Location) { }


  ngOnInit() {
    this.loadCurrentClient();
  }

  private loadCurrentClient() {
    this.client = this.clientService.client;
    this.remove = this.clientService.remove;
  }

  onOkClick(){
    this._location.back();
    //this.router.navigate(['client']);
  }

  public onRemoveClick() {
    this.clientService.removeClient(this.client).subscribe(
      () => {
        // this.loadClient();
        this.router.navigate(['client']);
      },
      error => {
        this.defaultServiceErrorHandling(error);
      }
    );
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
