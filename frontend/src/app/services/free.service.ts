import { Injectable } from '@angular/core';
import {Globals} from "../global/globals";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {PlannedTaskDto} from "../dtos/planned-task-dto";

@Injectable({
  providedIn: 'root'
})
export class FreeService {

  private employeeUrl: string = this.globals.backendUri + '/employees';
  private taskUrl: string = this.globals.backendUri + '/tasks';

  constructor(private httpClient: HttpClient,
              private globals: Globals) { }


  addSickDay(date: string, employeeId: number): Observable<PlannedTaskDto[]>{
    return this.httpClient.post<PlannedTaskDto[]>(this.employeeUrl + "/" + employeeId + "/sick?date=" + date , null);
  }

  addVacationDay(date: string, employeeId: number): Observable<PlannedTaskDto[]>{
    return this.httpClient.post<PlannedTaskDto[]>(this.employeeUrl + "/" + employeeId + "/vacation?date=" + date , null);
  }

  scheduleDeletedTasks(tasks: PlannedTaskDto[]): Observable<PlannedTaskDto[]>{
    return this.httpClient.post<PlannedTaskDto[]>(this.taskUrl + "/schedule-removed", tasks);
  }
}
