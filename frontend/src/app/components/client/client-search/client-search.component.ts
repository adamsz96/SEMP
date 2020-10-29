import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../../../services/client.service';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent implements OnInit {

  searchedName: string;
  searchedAddress: string;
  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private clientService: ClientService) { 
    this.searchForm = this.formBuilder.group({
      name: [''],
      address: ['']
    });
  }

  ngOnInit() {
  }

  onSearchClick(){
    if (!this.searchForm.valid) {
      return;
    }
    try {
      if(this.clientService.ClientList.length > 0) {
        let list = this.clientService.ClientList.map(x => Object.assign({}, x));
        // if (StringHelpers.isNullOrEmpty(this.searchForm.controls.name.value) === false) {
          if ((this.searchForm.controls.name.value === '' || this.searchForm.controls.name.value === null) === false) {
          const nameLength = this.searchForm.controls.name.value.length;
          list = list.filter(client => client.name.substring(0, nameLength) === this.searchForm.controls.name.value);
        }
        if ((this.searchForm.controls.address.value === '' || this.searchForm.controls.address.value === null) === false) {
          const nameLength = this.searchForm.controls.address.value.length;
          list = list.filter(client => client.address.includes(this.searchForm.controls.address.value));
        }
        this.clientService.ClientListFiltered = list;
        this.clientService.sendNewData();
      }
    } catch (ex) {
      console.log(ex);
    }
 }

}
