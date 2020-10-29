import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Client} from '../dtos/client';
import {Observable} from 'rxjs';
import {Globals} from '../global/globals';
import {HttpHeaders} from '@angular/common/http';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class ClientService  implements OnDestroy {

  private httpOptions = {
    headers: new HttpHeaders({'Access-Control-Allow-Origin': 'DELETE'
    })};
  private error: boolean = false;
  private errorMessage: string = '';
  private clientBaseUri: string = this.globals.backendUri + '/client';
  private complete$ = new Subject<any>();
 
  public create = true;
  public remove = false;
  public client: Client;
  public ClientList: Client[] = <Client[]>[];
  public ClientListFiltered: Client[] = <Client[]>[];
  public ClientListChanged$ = new ReplaySubject<any>(1);

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  //1.
  getClientList() {
    return this.httpClient.get<Client[]>(this.clientBaseUri)
      .pipe(takeUntil(this.complete$))
      .subscribe(result => {
        this.ClientList = <Client[]>result;
        this.ClientListFiltered = <Client[]>result;
        this.ClientListChanged$.next({ message: 'new data' });
      });
  }

  //2.
  getAllClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.clientBaseUri);
  }

  /*getClientList() {
    return this.httpClient.get<Client[]>(this.globals.backendUri + '/datagenerator')
      .pipe(takeUntil(this.complete$))
      .subscribe(result => {
        this.ClientList = <Client[]>result;
        this.ClientListFiltered = <Client[]>result;
        this.ClientListChanged$.next({ message: 'new data' });
      });
  }*/

  public sendNewData() {
    this.ClientListChanged$.next({ message: 'new data' });
  }

  private completeRequest(): void {
    // This aborts all HTTP requests.
    this.complete$.next();
    // This completes the subject properlly.
    this.complete$.complete();
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

  createClient(client: Client): Observable<Client> {
    console.log('Create client: ' + client.name + ' ' + client.address + ' ' + client.contactPersons);
    return this.httpClient.post<Client>(this.clientBaseUri, client);
  }

  editClient(client: Client): Observable<Client> {
    console.log('Edit client: ' + client.name + ' ' + client.address + ' ' + client.contactPersons);
    return this.httpClient.put<Client>(this.clientBaseUri, client);
  }

  removeClient(client: Client): Observable<{}> {
    return this.httpClient.delete(this.clientBaseUri + '/' + client.id, this.httpOptions);
  }
  fintOneById(id:number):Observable<Client>{
    console.log('Find Client for Id: '+id);
    return this.httpClient.get<Client>(this.clientBaseUri+'/'+id);
  }
  ngOnDestroy() {
    this.completeRequest();
  }
}
