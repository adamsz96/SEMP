import { Injectable } from '@angular/core';
import {DashboardDay} from '../components/dashboard/model/dashboardday';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';
// import {Observable} from 'rxjs/index';
import {OpenOrder} from '../components/dashboard/model/openorder';
import {Globals} from '../global/globals';
import { DashboardEmployee } from '../components/dashboard/model/dashboardemployee';
import { PlannedTask } from '../components/dashboard/model/plannedtask';
import { Skill } from '../dtos/skill';
import { OpenTask } from '../components/dashboard/model/opentask';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private dashboardUrl = this.globals.backendUri + '/dashboard';
  private openTaskUrl = this.globals.backendUri +'/dashboard/open-tasks';
  private deletePlannedTaskUrl = this.globals.backendUri + '/tasks/planned';
  plannedTaskList: PlannedTask[] = <PlannedTask[]>[];

  constructor(
    private http: HttpClient, private globals: Globals) { }

  getData(fromDate: String, toDate: String): Observable<DashboardDay[]>{

    const ret: Observable<DashboardDay[]> = this.http.get<DashboardDay[]>(this.dashboardUrl + '?from=' + fromDate + '&to=' + toDate)
       .pipe(
          map(x => {
            this.plannedTaskList = [];
            for (const day of x) {
              const list = new Map<number, DashboardEmployee>();
              for (const key in day.employees) {
                const employee = day.employees[key];
                const dashEmployee = new DashboardEmployee(employee.employeeId, employee.name);
                for (const task of employee.tasks)  {
                  try {
                  const plannedTask = new PlannedTask(task.plannedTaskId,task.concreteTaskId, new Date(task.plannedDate), task.plannedDuration,
                                                  task.productName, task.taskName, task.orderName);
                  if(typeof(plannedTask.plannedTaskId) !== 'undefined'){
                    this.plannedTaskList.push(plannedTask);
                  }
                  dashEmployee.tasks.push(plannedTask);
                  } catch (ex) {
                    console.log(ex);
                  }
                }
                for (const skill of employee.skills)  {
                  try {
                  const newSkill = new Skill(skill.id, skill.name);
                  dashEmployee.skills.push(newSkill);
                  } catch (ex) {
                    console.log(ex);
                  }
                }
                list.set(dashEmployee.employeeId, dashEmployee);
              }
              day.employees = list;
            }
            return x;
          })
      );
      return ret;
  }

  getOpenOrders(): Observable<OpenOrder[]> {
    const ret: Observable<OpenOrder[]> = this.http.get<OpenOrder[]>(this.openTaskUrl)
      .pipe(
        map(x => {
          const list = <OpenOrder[]>[];
          for (const order of x) {
            const taskList: OpenTask[] = <OpenTask[]>[];
            for(const task of order.tasks) {
              const newSkill: Skill = new Skill(task.skill.id, task.skill.name);
              const newTask = new OpenTask(task.taskId,task.productName, task.taskName, order.orderName, task.plannedDuration,
                newSkill, task.parentTasks);
              taskList.push(newTask);
            }
            const y = new OpenOrder(order.orderId, order.orderName, taskList);
            list.push(y);
          }
          return list;
        })
      );
      return ret;
  }

  deletePlannedTaskById(id: number): Observable<{}>{
    console.log('Delete Task: ' + id + ' on: ' + this.deletePlannedTaskUrl+ '/' + id);
    return this.http.delete(this.deletePlannedTaskUrl + '/' + id);
  }

}
