import { Component, OnInit } from '@angular/core';
import {PlannedTaskDetailsDto} from "../../dtos/planned-task-details-dto";
import {PlannedTaskServiceService} from "../../services/planned-task-service.service";
import {Globals} from "../../global/globals";
import {ActivatedRoute, Router} from "@angular/router";
import {PlannedTaskDto} from "../../dtos/planned-task-dto";

@Component({
  selector: 'app-planned-task-details',
  templateUrl: './planned-task-details.component.html',
  styleUrls: ['./planned-task-details.component.scss']
})
export class PlannedTaskDetailsComponent implements OnInit {

  data: PlannedTaskDetailsDto;

  moveDate: string;
  moveEmployee: number;
  taskId: number;
  taskDuration: number;

  constructor(private plannedTaskService: PlannedTaskServiceService, private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params); //log the entire params object
      console.log(params['id']); //log the value of id
      this.taskId = params['id'];
    });

    this.plannedTaskService.getData(this.taskId).subscribe(newTask =>{
      console.log(newTask);
      this.data = new PlannedTaskDetailsDto(newTask.id,"this", "that", newTask.plannedDuration, newTask.productName, newTask.productId, newTask.employeeId  );
      this.taskDuration = this.data.plannedTaskDuration*15;
      this.moveEmployee = this.data.employeeId;
      this.moveDate = new Date(newTask.plannedDate).toISOString();
      console.log(this.data);
    } );
  }

  updateTask(){
    console.log(this.moveDate);
    let date = new Date(Date.parse(this.moveDate));

    console.log(date);
    this.plannedTaskService.moveTask(this.taskId, date.toISOString(), this.moveEmployee, Math.round(this.taskDuration/15)).subscribe(x => {
      this.router.navigate(["/dashboard"]);
    }, error => {
      alert("Task could not be rescheduled, beacuse: " + error.error.message)
    })
  }

  updateTime(){
    this.plannedTaskService.updatePlannedTime(new PlannedTaskDto(this.data.plannedTaskId, null, this.taskDuration/15, this.moveEmployee, 1));
  }

}
