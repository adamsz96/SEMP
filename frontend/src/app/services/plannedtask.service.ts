import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Client} from '../dtos/client';
import {Observable} from 'rxjs';
import {Globals} from '../global/globals';
import {HttpHeaders} from '@angular/common/http';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
  })

export class PlannedTaskService  implements OnDestroy {

  private taskUrl = this.globals.backendUri + '/tasks';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
      })
  };

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

  createPlannedTask(plannedDate: Date, plannedDuration: number, employeeId: number, concreteTaskId: number): Observable<Object> {
    // console.log('Create client: ' + client.name + ' ' + client.address + ' ' + client.contactPersons);
    try {
      console.log("CREATE PLANNED TASK");
      const plannedDateText = formatDate(plannedDate, 'yyyy-MM-dd HH:mm', 'en-US');
      return this.httpClient.post(this.taskUrl + '/planned/new?' + 'plannedDate=' + plannedDateText +
          '&plannedDuration=' + plannedDuration + '&employeeId=' + employeeId + '&concreteTaskId=' + concreteTaskId, {}, this.httpOptions)
    } catch (ex) {
      console.log("EXCEPTION");
      console.log(ex);
      return null;
    }
  }

  createPlannedTask_old(plannedDate: Date, plannedDuration: number, employeeId: number, concreteTaskId: number) {
    /*const body = {
      'id': 0,
      'plannedDate': plannedDate,
      'plannedDuration': plannedDuration,
      'employeeId': employeeId,
      'concreteTaskId': concreteTaskId
    };*/
    /* try {
    return this.http.post(this.taskUrl + '/planned?' + /*'plannedDate=' + plannedDate +'plannedDuration='+ plannedDuration + 
            '&employeeId=' + employeeId + '&concreteTaskId=' + concreteTaskId, {}, this.httpOptions);
      .pipe(
        tap(x => {
          console.log(x);
        })
      );*/
  }

  ngOnDestroy() {
    this.completeRequest();
  }
}
