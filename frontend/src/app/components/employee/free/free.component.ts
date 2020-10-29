import { Component, OnInit } from '@angular/core';
import {Employee} from "../../../dtos/employee";
import {Globals} from "../../../global/globals";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {EmployeeService} from "../../../services/employee.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {PlannedTaskDto} from "../../../dtos/planned-task-dto";
import {FreeService} from "../../../services/free.service";

@Component({
  selector: 'app-free',
  templateUrl: './free.component.html',
  styleUrls: ['./free.component.scss']
})
export class FreeComponent implements OnInit {

  private employee: Employee;
  private minDate: NgbDate;
  private newSickDate: NgbDate;
  private newVacationDate: NgbDate;

  private removedTasks: PlannedTaskDto[];
  private rescheduledTasks: PlannedTaskDto[];

  private rescheduled: boolean;

  constructor(private route: ActivatedRoute,
              public globals: Globals,
              private router: Router,
              private toastr: ToastrService,
              private employeeService: EmployeeService,
              private freeService: FreeService) {

  }

  ngOnInit() {
    this.initMinDate();
    this.rescheduled = false;
    this.route.params.subscribe(params => {
      console.log(params); //log the entire params object
      console.log(params['id']); //log the value of id
      let id = params['id'];
      this.employeeService.getEmployeeById(id).subscribe(
        data => {
          this.employee = data;
        },
        error1 => {
          this.toastr.error("Could not load employee with id: " + id + ", because: " + error1.error.message);
        }
      )
    });

  }

  initMinDate(){
    let date = new Date();
    this.newSickDate = NgbDate.from({year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate()})
    this.newVacationDate = NgbDate.from({year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate()})
    this.minDate = NgbDate.from({year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate()})
  }

  addSickDay(){

    let sickDate = new Date();

    let date = this.zeroPad(this.newSickDate.year, 4) + "-" +
      this.zeroPad(this.newSickDate.month, 2) + "-" +
      this.zeroPad(this.newSickDate.day, 2)

    this.freeService.addSickDay(date, this.employee.id).subscribe(data =>
      {
        this.rescheduled = false;
        this.removedTasks = data;
        if(data.length > 0){
          this.toastr.warning("The sick day could successfully be set, but there are some tasks that are now unscheduled!");
        }
        else{
          this.toastr.success("Successfully added sick day!");
        }
      },
      error => {
        this.toastr.error("Could not add sick day, because: " + error.error.message);
      }
    )

  }

  addVacationDay(){

    let date = this.zeroPad(this.newVacationDate.year, 4) + "-" +
      this.zeroPad(this.newVacationDate.month, 2) + "-" +
      this.zeroPad(this.newVacationDate.day, 2)

    this.freeService.addVacationDay(date, this.employee.id).subscribe(data =>
      {
        this.rescheduled = false;
        this.removedTasks = data;
        if(data.length > 0){
          this.toastr.warning("The vacation day could successfully be set, but there are some tasks that are now unscheduled!");
        }
        else{
          this.toastr.success("Successfully added the vacation day!");
        }
      },
      error => {
        this.toastr.error("Could not add vacation day, because: " + error.error.message);
      }
    )

  }

  scheduleOpenTasks(){
    this.freeService.scheduleDeletedTasks(this.removedTasks).subscribe(data =>
    {
      this.rescheduledTasks = data;
      this.toastr.success("Successfully rescheduled the open tasks.");
      this.rescheduled = true;
    },
      error => {
        this.toastr.error("Not all of the open tasks could be scheduled, because: " + error.errorm.message + ". Please schedule them manually in the dashboard.");
        this.rescheduled = true;
    })
  }

  getRescheduledTaskByConcreteTaskId(concreteTaskId: number){
    if(this.rescheduledTasks){
      for (let task of this.rescheduledTasks){
        if(task.concreteTaskId == concreteTaskId){
          return task;
        }
      }
    }

    return null;
  }

  zeroPad(num: number, places: number): string{
    let s = String(num);
    while (s.length < (places || 2)) {s = "0" + s;}
    return s;
  }

}
