import { Injectable } from '@angular/core';
import {PlannedTaskDetailsDto} from '../dtos/planned-task-details-dto';
import {Globals} from '../global/globals';
import {DashboardDay} from '../components/dashboard/model/dashboardday';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {toDate} from '@angular/common/src/i18n/format_date';
import {UserCalendarService} from './user-calendar.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs";
import {PlannedTaskDto} from "../dtos/planned-task-dto";

@Injectable({
  providedIn: 'root'
})
export class PlannedTaskServiceService {

  private taskUrl = this.globals.backendUri + '/tasks';
  private id:number;

  constructor(private http: HttpClient, private globals: Globals) { }
  private httpOptions = {
    headers: new HttpHeaders({'Access-Control-Allow-Origin': 'POST'
    })};

  getData(id: number): Observable<PlannedTaskDto>{
    /*return {
      plannedTaskId: 1,
      plannedTaskDuration: 8,
      taskName: 'Markisenrahmen bauen',
      taskDescription: '1. Rahmenteile auschneiden. \n 2. Rahmenteile verkleben',
      productName: 'Markise BIMAZ',
      productId: 29163
    };
    */
    return this.http.get<PlannedTaskDto>(this.taskUrl+"/planned/" + id);
  }

  createPlannedTask(plannedDate: Date, plannedDuration: number, employeeId: number, concreteTaskId: number) {
    /*const body = {
      'id': 0,
      'plannedDate': plannedDate,
      'plannedDuration': plannedDuration,
      'employeeId': employeeId,
      'concreteTaskId': concreteTaskId
    };*/
    try {
    return this.http.post(this.taskUrl + '/planned?' + /*'plannedDate=' + plannedDate +*/ 'plannedDuration='+ plannedDuration + 
            '&employeeId=' + employeeId + '&concreteTaskId=' + concreteTaskId, {}, this.httpOptions);
      /*.pipe(
        tap(x => {
          console.log(x);
        })
      );*/
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /**
   *
   * @param plannedTaskDto
   */
  updatePlannedTime(plannedTaskDto : PlannedTaskDto): void{
    console.log("call updateplannedTime Service");
    console.log(this.taskUrl + '/move/'+plannedTaskDto.id +"?employeeId=" + plannedTaskDto.employeeId + "&duration=" + plannedTaskDto.plannedDuration);
    this.http.post(this.taskUrl + '/move/'+plannedTaskDto.id +"?employeeId=" + plannedTaskDto.employeeId + "&duration=" + plannedTaskDto.plannedDuration, plannedTaskDto)
      .subscribe(_ => {}, (error) => {
        console.log("ERROR!");
        console.log(error);
        alert("Task could not be updated, because: " + error.error.message);
      });

    console.log("updatePlannedTime Service done");
  }

  /*
  @ApiModelProperty(required = true, name = "The planned date of the task")
    private Instant plannedDate;

    @ApiModelProperty(required = true, name = "The planned duration of the task")
    private Integer plannedDuration;

    @ApiModelProperty(required = true, name = "The id of the employee that works on the task")
    private Long employeeId;

    @ApiModelProperty(required = true, name = "The id of the concrete task, this task is planned for")
    private Long concreteTaskId;
  */

  moveTask(taskId: number, moveDate: String, employeeId: number, duration: number){
    console.log("POST: " + this.taskUrl + '/move/' + taskId + '?to='+moveDate+'&employeeId='+employeeId + '&duration=' + duration);
    return this.http.post<{}>(this.taskUrl + '/move/' + taskId + '?to='+moveDate+'&employeeId='+employeeId + '&duration=' + duration,
      null)
      .pipe(
        tap(x => console.log(x))
      );
  }

}
