import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../global/globals";
import {Observable} from "rxjs";
import {ConcreteTask} from "../dtos/concreteTask";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskBaseUrl: string = this.globals.backendUri + '/tasks';

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  getConcreteTask(id: number): Observable<ConcreteTask>{
    console.log('Load concreteTask details for ' + id);
    return this.httpClient.get<ConcreteTask>(this.taskBaseUrl + '/concrete/' + id);
  }

  saveConcreteTask(concreteTask: ConcreteTask): Observable<ConcreteTask>{
    console.log('Save concreteTask with id '+ concreteTask.id);
    return this.httpClient.post<ConcreteTask>(this.taskBaseUrl + '/concrete', concreteTask);
  }

  updateConcreteTask(concreteTask: ConcreteTask): Observable<ConcreteTask>{
    console.log('Update concreteTask with id '+ concreteTask.id);
    return this.httpClient.put<ConcreteTask>(this.taskBaseUrl + '/concrete', concreteTask);
  }

}
