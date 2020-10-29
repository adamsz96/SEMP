import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DashboardEmployee } from '../model/dashboardemployee';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DeletePlannedTaskEvent } from '../model/deleteplannedtask.event';
import { PlannedTask } from '../model/plannedtask';
import { PlannedTaskDetailsDto } from 'src/app/dtos/planned-task-details-dto';
import { TimeSlot } from '../model/timeslot';
import { OpenTask } from '../model/opentask';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AddTaskComponent } from '../addtask/addtask.component';
import { Employee } from 'src/app/dtos/employee';

@Component({
  selector: 'app-dashboard-employee',
  templateUrl: './dashboard-employee.component.html',
  styleUrls: ['./dashboard-employee.component.scss']
})
export class DashboardEmployeeComponent implements OnInit, OnChanges {
  @Input() employee: DashboardEmployee;
  @Input() addHidden: boolean;
  @Input() currentActiveTask: OpenTask; // = new OpenTask(0);
  @Input() selectMode: boolean = false;
  @Output() private createPlannedTaskEvent = new EventEmitter<string>();
  @Output() private deletePlannedTaskEvent = new EventEmitter<DeletePlannedTaskEvent>();
  public addFaAngleDown: boolean;
  openTimeSlotList = <TimeSlot[]>[];


  constructor(private dashboardService: DashboardService, private modalService: NgbModal) {
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    // this.calculateLongestBrake();
    this.createTimeSlots();
    this.calculateLongestBrake();
  }

  ngOnInit() { }

  calculateEndTime(date: Date, duration: number): Date{
    let extraHours =  Math.floor(duration / 4);
    let extraMinutes = (duration - (4 * extraHours)) * 15;
    let result = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
    date.getHours() + extraHours, date.getMinutes() + extraMinutes, date.getSeconds(), date.getMilliseconds());
    return result;
  }

  calculateBreak(firstDate: Date, secondDate: Date){
    const result = ((secondDate.getHours() * 60 + secondDate.getMinutes())
                          - (firstDate.getHours() * 60 + firstDate.getMinutes())) / 15;
      return result;
  }

  createTimeSlots() {
    const taskList: PlannedTask[] = this.employee.tasks;
    this.sortByDate(taskList);
    this.employee.timeSlotList = <TimeSlot[]>[];

    const endDate: Date = new Date(taskList[0].plannedDate.getFullYear(), taskList[0].plannedDate.getMonth(),
                                    taskList[0].plannedDate.getDate(), 17, 0, 0, 0);

    const startDate: Date = new Date(taskList[0].plannedDate.getFullYear(), taskList[0].plannedDate.getMonth(),
                                      taskList[0].plannedDate.getDate(), 8, 0, 0, 0);

    const firstBreak: number = this.calculateBreak(startDate, taskList[0].plannedDate);
    if (firstBreak > 0) {
      try {
        this.employee.timeSlotList.push(new TimeSlot('freetime', startDate, taskList[0].plannedDate, firstBreak));
      } catch(ex) {
        console.log(ex);
      }
    }

    if (taskList.length > 1) {
      for (let i = 0; i < taskList.length - 1; i++) {

        const firstTaskStart: Date = taskList[i].plannedDate;
        const secondTaskStart: Date = taskList[i + 1].plannedDate;
        const firstTaskLength: number = taskList[i].plannedDuration;
        const firstTaskEnd = this.calculateEndTime(firstTaskStart, firstTaskLength);

        this.employee.timeSlotList.push(new TimeSlot('task', firstTaskStart, firstTaskEnd, firstTaskLength));
        const break1 = this.calculateBreak(firstTaskEnd, secondTaskStart);

        if (break1 > 0) {
          this.employee.timeSlotList.push(new TimeSlot('freetime', firstTaskEnd, secondTaskStart, break1));
        }
      }
    }
    const lastTaskStart = taskList[taskList.length - 1].plannedDate;
    const lastTaskLength = taskList[taskList.length - 1].plannedDuration;
    const lastTaskEnd = this.calculateEndTime(taskList[taskList.length - 1].plannedDate, taskList[taskList.length - 1].plannedDuration);
    this.employee.timeSlotList.push(new TimeSlot('task', lastTaskStart, lastTaskEnd, lastTaskLength));
    const lastBreak = this.calculateBreak(lastTaskEnd, endDate);

    if (lastBreak > 0) {
      this.employee.timeSlotList.push(new TimeSlot('freetime', lastTaskEnd, endDate, lastBreak));
    }
  }

  calculateLongestBrake() {
    const list: TimeSlot[] = this.employee.timeSlotList.filter((a: TimeSlot) => {
      if(a.type === 'freetime') {
        return a;
      }
    }).sort((a: TimeSlot, b: TimeSlot) => {
        return -1 * (a.duration - b.duration);
    });
    // console.log(list);
    if(list != null && list.length > 0) {
      this.employee.longestBreak = list[0].duration;
      this.employee.longestBreakStartDate = list[0].startTime;
    }
  }

  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }


  public sortByDate(tasks: PlannedTask[]): void {
    tasks.sort((a: PlannedTask, b: PlannedTask) => {
        return this.getTime(a.plannedDate) - this.getTime(b.plannedDate);
    });
  }

  checkDuration(): boolean {
    if (typeof(this.currentActiveTask) !== 'undefined' && this.currentActiveTask.plannedDuration > 0) {
      //console.log('selected');
    }
    if(this.selectMode === false){
      return false;
    }

    let requiredskill = false;
    for (const skill of this.employee.skills) {
      if (skill.id === this.currentActiveTask.skill.id) {
        requiredskill = true;
      }
    }
    if (requiredskill === false){
      return false;
    }

    if(this.currentActiveTask.plannedDuration > this.employee.longestBreak) {
      return false;
    }

   /*const plannedList = this.dashboardService.plannedTaskList;
    for (let tid of this.currentActiveTask.parentTasks) {
      for (const task of plannedList) {
        if (tid === task.concreteTaskId) {
          if (task.plannedDate >= this.employee.longestBreakStartDate) {
            return false;
          }
        }
      }
    }*/
    this.calculateOpenTimeSlots();
    if(this.openTimeSlotList.length === 0){
      return false;
    }


    if (this.selectMode === true) {
      return true;
    }
    return false;
  }

  calculateOpenTimeSlots() {

    const parentList = <PlannedTask[]>[];
    const plannedList = this.dashboardService.plannedTaskList;
    for (let tid of this.currentActiveTask.parentTasks) {
      for (const task of plannedList) {
        if (tid === task.concreteTaskId) {
          parentList.push(task);
        }
      }
    }

    this.openTimeSlotList = <TimeSlot[]>[];
    let longest: number = 0;
    let longestBegining: Date;

    for (let ts of this.employee.timeSlotList){
      if (ts.type === 'freetime' && ts.duration >= this.currentActiveTask.plannedDuration) {
        const slotnumber = ts.duration - this.currentActiveTask.plannedDuration;
        for (let i = 0; i <= slotnumber; i++) {
          let beginning = this.calculateEndTime(ts.startTime, i);
          let end = this.calculateEndTime(beginning, this.currentActiveTask.plannedDuration);
          if(this.currentActiveTask.parentTasks.length > 0) {
            let insert = true;
            for(const parent of parentList){
              if(this.calculateEndTime(parent.plannedDate,parent.plannedDuration) > beginning){
                insert = false;
              }
            }
            if(insert === true){
              if(this.currentActiveTask.plannedDuration + slotnumber - i > longest){
                longest = this.currentActiveTask.plannedDuration + slotnumber - i;
                longestBegining = beginning;
              }
              this.openTimeSlotList.push(new TimeSlot('freetime', beginning, end, this.currentActiveTask.plannedDuration));
            }
          } else {
            if(this.currentActiveTask.plannedDuration + slotnumber - i > longest){
              longest = this.currentActiveTask.plannedDuration + slotnumber - i;
              longestBegining = beginning;
            }
            this.openTimeSlotList.push(new TimeSlot('freetime', beginning, end, this.currentActiveTask.plannedDuration));
          }
          
        }
      }
    }
    if(this.openTimeSlotList.length > 0) {
      this.employee.longestBreak = longest;
      this.employee.longestBreakStartDate = longestBegining;
    }
  }

  selectEmployee(event: MouseEvent) {
    event.stopPropagation();
    console.log('select employee');
    if (this.selectMode === false) {
      return;
    }
    if (typeof(this.currentActiveTask) === 'undefined' || this.currentActiveTask === null ||
          this.currentActiveTask.plannedDuration < 0 || this.checkDuration() === false) {
      return;
    }

    try {
      const modalRef = this.modalService.open(AddTaskComponent);
      modalRef.componentInstance.employee = this.employee;
      modalRef.componentInstance.currentActiveTask = this.currentActiveTask;
      modalRef.componentInstance.openTimeSlotList = this.openTimeSlotList;
      modalRef.result.then(result => this.resolveAddTaskModal(result));
      // modalRef.componentInstance.
    } catch (ex) {
      console.log(ex);
    }
  }

  resolveAddTaskModal(result: any) {
    if (typeof(result) === 'string' && result === 'Task properly saved') {
      this.createPlannedTaskEvent.emit(result);
    }
    console.log(result);
  }

  toggle(event: MouseEvent) {
    event.stopPropagation();
    if (this.addFaAngleDown === true)
    {
      this.addFaAngleDown = false;
    } else {
      this.addFaAngleDown = true;
    }
    if (this.addHidden === true)
    {
      this.addHidden = false;
    } else {
      this.addHidden = true;
    }
  }

  deletePlannedTask(id: number){
    this.dashboardService.deletePlannedTaskById(id).subscribe(x => this.deletePlannedTaskEvent.emit(new DeletePlannedTaskEvent()));
  }
}
