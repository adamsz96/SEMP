import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OpenOrder } from '../model/openorder';
import { TaskSelectedEvent } from '../model/taskselected.event';
import { OpenTask } from '../model/opentask';

@Component({
  selector: 'app-dashboard-order',
  templateUrl: './dashboard-order.component.html',
  styleUrls: ['./dashboard-order.component.scss']
})
export class DashboardOrderComponent implements OnInit {

  @Input() openOrder: OpenOrder;
  @Input() selectMode: boolean = false;
  @Input() currentActiveTask: OpenTask;
  @Output() taskSelectedEvent = new EventEmitter<TaskSelectedEvent>();

  constructor() { }

  ngOnInit() {
  }

  isSelectable(i: number): boolean{
    const tasklist = this.openOrder.tasks
    const task: OpenTask = tasklist[i];
    if(task.parentTasks.length === 0) {
      return true;
    }
    let flag = false;
    for(const t of tasklist){
      for(const j of task.parentTasks){
        if(j === t.taskId){
          flag = true;
        }
      }
    }
    if(flag === false){
      return true;
    }
    return false;
  }

  selectTask(taskIndex: number) {
    console.log(taskIndex);
    if(this.isSelectable(taskIndex)){
      try {
        if(typeof(this.currentActiveTask) === 'undefined') {
          this.taskSelectedEvent.emit(new TaskSelectedEvent('select', this.openOrder.orderId, this.openOrder.tasks[taskIndex]));
        } else {
          if (this.currentActiveTask.taskId === this.openOrder.tasks[taskIndex].taskId) {
            this.taskSelectedEvent.emit(new TaskSelectedEvent('unselect', this.openOrder.orderId, this.openOrder.tasks[taskIndex]));
          } else {
            this.taskSelectedEvent.emit(new TaskSelectedEvent('select', this.openOrder.orderId, this.openOrder.tasks[taskIndex]));
          }
        }
      } catch(ex) {
        console.log(ex);
      }
    }
  }
}
