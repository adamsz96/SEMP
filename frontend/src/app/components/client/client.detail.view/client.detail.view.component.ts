import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Client} from '../../../dtos/client';
import {ClientService} from '../../../services/client.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import {AuthenticationService} from "../../../services/authentication.service";
import { Router, ActivatedRoute, Event, NavigationEnd, ActivationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client.detail.view',
  templateUrl: './client.detail.view.component.html',
  styleUrls: ['./client.detail.view.component.scss']
})
export class ClientDetailViewComponent implements OnInit {

  error: boolean = false;
  errorMessage: string = '';
  clientForm: FormGroup;
  // After first submission attempt, form validation will start
  submitted: boolean = false;
  selectedClientId: number = -1;
  public client: Client;
  public clientInit: Client;
  public create: boolean;
  public noChangesInfo: boolean;
  public createClicked: boolean;

  constructor(private clientService: ClientService, private ngbPaginationConfig: NgbPaginationConfig, private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef, private authService: AuthenticationService,
    private router: Router, private route: ActivatedRoute, private location: Location) {
    const localThis = this;
    router.events.subscribe(val => {
      localThis.locationChanged(val);
    });
    this.clientForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(250)]],
      address: ['', [Validators.required, Validators.maxLength(500)]],
      infos: ['', [Validators.maxLength(500)]],
      email: ['', [Validators.maxLength(500)]],
      telephone: ['', [Validators.required, Validators.maxLength(250)]],
      contact: ['', [Validators.maxLength(500)]],
    });
}

  ngOnInit() {
  }

  locationChanged(event: Event) {
    if (event instanceof ActivationEnd && this.location.path() !== '') {
      const val = <ActivationEnd>event;
      if(val.snapshot.url.length === 2 && val.snapshot.url[0].path == 'client' && val.snapshot.url[1].path === 'new') {
        this.create = true;
      } else if(val.snapshot.url.length === 3 && val.snapshot.url[0].path === 'client' && val.snapshot.url[1].path === 'edit') {
        this.create = false;
        this.selectedClientId = Number.parseInt(val.snapshot.url[2].path, 10);
        if(this.selectedClientId > 0) {
          this.loadCurrentClient();
        }
    }
  }
}

  onCancelClick() {
    this.router.navigate(['client']);
  }

  onCreateClick() {
    this.submitted = true;
    console.log(this.clientForm);
    if (this.clientForm.valid) {
      const client: Client = new Client(null,
        this.clientForm.controls.name.value,
        this.clientForm.controls.address.value,
        this.clientForm.controls.infos.value,
        this.clientForm.controls.email.value,
        this.clientForm.controls.telephone.value,
        this.clientForm.controls.contact.value,
      );
      this.createClient(client);
      this.clearForm();
    } else {
      console.log('Invalid input');
      this.createClicked = true;
    }
  }

  createClient(client: Client) {
    this.clientService.createClient(client).subscribe(
      () => {
        // this.loadClient();
        this.router.navigate(['client']);
      },
      error => {
        this.defaultServiceErrorHandling(error);
      }
    );
  }

  onEditClick() {
    this.submitted = true;
    console.log(this.clientForm);
    if (this.clientForm.valid) {
      const client: Client = new Client(this.client.id,
        this.clientForm.controls.name.value,
        this.clientForm.controls.address.value,
        this.clientForm.controls.infos.value,
        this.clientForm.controls.email.value,
        this.clientForm.controls.telephone.value,
        this.clientForm.controls.contact.value,
      );
      if(!this.checkValuesEquality(this.clientInit, client)) {
        this.editClient(client);
        this.clearForm();
      } else {
        this.submitted = false;
        this.noChangesInfo = true;
      }
    } else {
      console.log('Invalid input');
    }
  }

  checkValuesEquality(client1: Client, client2: Client): boolean {
    if((client1.name === client2.name || (typeof(client1.name) === 'undefined' && typeof(client2.name) === 'undefined')) &&
    (client1.address === client2.address || (typeof(client1.address) === 'undefined' && typeof(client2.address) === 'undefined')) &&
    (client1.infos === client2.infos || (typeof(client1.infos) === 'undefined' && typeof(client2.infos) === 'undefined')) &&
    (client1.emails === client2.emails || (typeof(client1.emails) === 'undefined' && typeof(client2.emails) === 'undefined')) && 
    (client1.phoneNumbers === client2.phoneNumbers ||
       (typeof(client1.phoneNumbers) === 'undefined' && typeof(client2.phoneNumbers) === 'undefined')) &&
    (client1.contactPersons === client2.contactPersons ||
       (typeof(client1.contactPersons) === 'undefined' && typeof(client2.contactPersons) === 'undefined'))) {
      return true;
    }
    return false;
  }

  editClient(client: Client) {
    this.clientService.editClient(client).subscribe(
      () => {
        // this.loadClient();
        this.router.navigate(['client']);
      },
      error => {
        this.defaultServiceErrorHandling(error);
      }
    );
  }

  


private loadCurrentClient() {
  this.client = this.clientService.client; // new Client(1, 'cl1', 'ad1', 'inf1', 'em1', 'np1', 'cp1');
  this.clientInit = new Client(this.client.id, this.client.name, this.client.address, this.client.infos,
                                this.client.emails, this.client.phoneNumbers, this.client.contactPersons);
  this.clientForm.patchValue({
    'name':this.client.name,
    'address':this.client.address,
    'contact':this.client.contactPersons,
    'infos':this.client.infos,
    'telephone':this.client.phoneNumbers,
    'email':this.client.emails
  });
}

  /*private loadClient() {
    // Backend pagination starts at page 0, therefore page must be reduced by 1
    this.clientService.getClient().subscribe(
      (client: Client[]) => {
        this.client = client;
      },
      error => {
        this.defaultServiceErrorHandling(error);
      }
    );
  }*/

  private clearForm() {
    this.clientForm.reset();
    this.submitted = false;
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
