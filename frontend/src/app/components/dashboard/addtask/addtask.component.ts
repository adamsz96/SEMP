import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardEmployee } from '../model/dashboardemployee';
import { OpenTask } from '../model/opentask';
import { TimeSlot } from '../model/timeslot';
import { filterQueryId } from '@angular/core/src/view/util';
import { PlannedTaskService } from 'src/app/services/plannedtask.service';

@Component({
  selector: 'add-task-modal',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddTaskComponent implements OnInit, OnChanges{
  @Input() employee: DashboardEmployee;
  @Input() currentActiveTask: OpenTask;
  @Input() openTimeSlotList: TimeSlot[];
  public filteredList: TimeSlot[]
  public activeIndex = -1;

  constructor(private plannedTaskService:  PlannedTaskService, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.filterTimeSlotList();
  }

  ngOnChanges(changes: SimpleChanges) {    
  }

  taskSelected(index: number){
    this.activeIndex = index;
  }

  onSaveClick() {
    if (this.activeIndex < 0) {
      console.log('wrong active index');
      return;
    }
    if (typeof(this.openTimeSlotList) === 'undefined' || this.openTimeSlotList === null || this.openTimeSlotList.length === 0 || 
            this.activeIndex > this.openTimeSlotList.length - 1) {
      console.log('openList error');
      return;
    }
    if (typeof(this.employee) === 'undefined' || this.employee === null) {
      console.log('employee error');
      return;
    }
    if (typeof(this.currentActiveTask) === 'undefined' || this.currentActiveTask === null) {
      console.log('active task error');
      return;
    }

    this.plannedTaskService.createPlannedTask(
      this.openTimeSlotList[this.activeIndex].startTime,
      this.currentActiveTask.plannedDuration,
      this.employee.employeeId,
      this.currentActiveTask.taskId).subscribe((value) => {
        console.log(value);
        this.activeModal.close('Task properly saved');
      },
      (error) => {
        console.log("ERROR!");
        console.log(error);
        alert("Task could not be scheduled, because: " + error.error.message);

      });
  }

  /*onSaveClick() {
    if (this.activeIndex < 0) {
      console.log('wrong active index');
      return;
    }
    if (typeof(this.filteredList) === 'undefined' || this.filteredList === null || this.filteredList.length === 0 || 
            this.activeIndex > this.filteredList.length - 1) {
      console.log('filteredList error');
      return;
    }
    if (typeof(this.employee) === 'undefined' || this.employee === null) {
      console.log('employee error');
      return;
    }
    if (typeof(this.currentActiveTask) === 'undefined' || this.currentActiveTask === null) {
      console.log('active task error');
      return;
    }

    this.plannedTaskService.createPlannedTask(
      this.filteredList[this.activeIndex].startTime,
      this.currentActiveTask.plannedDuration,
      this.employee.employeeId,
      this.currentActiveTask.taskId).subscribe((value) => {
        console.log(value);
        this.activeModal.close('Task properly saved');
      },
      (error) => {
        console.log("ERROR!");
        console.log(error);
        alert("Task could not be scheduled, because: " + error.error.message);

      });
  }*/

  filterTimeSlotList() {
    this.filteredList = this.employee.timeSlotList.filter((a: TimeSlot) => {
      if (a.type === 'freetime' && a.duration >= this.currentActiveTask.plannedDuration) {
        return a;
      }
    });
    if (this.filteredList.length > 0) {
      let shortestIndex = 0;
      let shortestTimeSlot = this.filteredList[0];
      for(const i in this.filteredList) {
        if(this.filteredList[i].duration < shortestTimeSlot.duration) {
          shortestIndex = Number.parseInt(i, 0);
          shortestTimeSlot = this.filteredList[i];
        }
      }
      this.activeIndex = shortestIndex;
    }
    // console.log(this.filteredList);
  }

  checkValue(propValue: any): boolean {
    if (typeof(propValue) !== 'undefined' && propValue !== null){
      return true;
    }
    return false;
  }
}
