import {Component, OnInit, Renderer2} from '@angular/core';
import {DashboardDay} from './model/dashboardday';
import {DashboardService} from '../../services/dashboard.service';
import {OpenOrder} from './model/openorder';
import {formatDate} from '@angular/common';
import {hasClassName} from '@ng-bootstrap/ng-bootstrap/util/util';
import {forEach} from '@angular/router/src/utils/collection';
import { TaskSelectedEvent } from './model/taskselected.event';
import { OpenTask } from './model/opentask';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  fromDate: Date;
  toDate: Date;
  showToDate: Date;

  dashboardDayList: DashboardDay[];
  openOrderList: OpenOrder[];

  hideAll: boolean = false;

  selectMode: boolean = false;
  currentActiveTask: OpenTask = new OpenTask(-1);

  constructor(private dashboardService: DashboardService, private renderer: Renderer2) { }

  ngOnInit() {
    this.initDates();
    this.getData();
  }

  getData(): void{
    this.dashboardService.getOpenOrders().subscribe(openTasks => {
      // openTasks[4].selectedTaskId = 209;
      this.openOrderList = openTasks;
    });
    this.getCalendarData();
    this.selectMode = false;
    this.currentActiveTask = new OpenTask(-1);
  }

  getCalendarData(){
    this.dashboardService.getData(formatDate(this.fromDate, 'yyyy-MM-dd', 'en-US'), formatDate(this.toDate, 'yyyy-MM-dd', 'en-US'))
    .subscribe(data => {
      this.dashboardDayList = data;
    });
  }

  initDates(){
    this.fromDate = new Date();
    this.calcToDate();
  }

  isToday(someDate: Date): boolean {
    const today = new Date();
    const x = new Date(someDate);
    return x.getDay() == today.getDay() &&
      x.getMonth() == today.getMonth() &&
      x.getFullYear() == today.getFullYear();
  }

  calcToDate(){
    this.toDate = new Date(this.fromDate.getTime());

    this.toDate.setDate(this.fromDate.getDate()+5);

    if(this.fromDate.getDay() > 1){
      this.toDate.setDate(this.toDate.getDate() + 2);
    }
    this.showToDate = new Date(this.toDate);
    this.showToDate.setDate(this.showToDate.getDate()-1);
    console.log(this.showToDate);
  }

  

  addDays(days: number){
    let newDate = new Date(this.fromDate);
    newDate.setDate(this.fromDate.getDate() + days);
    console.log(newDate.getDay());
    if(newDate.getDay() == 6){
      if(days > 0){
        newDate.setDate(newDate.getDate() + 2);
      }
      else{
        newDate.setDate(newDate.getDate()-1);
      }
    }
    else if(newDate.getDay() == 0){
      if(days > 0){
        newDate.setDate(newDate.getDate() + 1);
      }
      else{
        newDate.setDate(newDate.getDate()-2);
      }
    }
    this.fromDate = newDate;

    // this.fromDate.setDate(this.fromDate.getDate()+days); directly setting does not change the date in the UI
    this.calcToDate();
    console.log(days + 'From: ' + this.fromDate + ' - ' + this.toDate);

    this.getCalendarData();
  }

  onTaskSelected(event: TaskSelectedEvent) {
    if (event !== null) {
      for (const openOrder of this.openOrderList){
        if (openOrder.orderId === event.orderId){
          if (event.type === 'select') {
            openOrder.selectedTaskId = event.task.taskId;
            this.currentActiveTask = event.task;
            this.selectMode = true;
          } else if (event.type === 'unselect') {
            openOrder.selectedTaskId = -1;
            this.currentActiveTask = new OpenTask(-1);
            this.selectMode = false;
          }
        } else {
          openOrder.selectedTaskId = -1;
        }
      }
    }
  }

  /*toggleAll(event:any){

    /*const close = event.target.parentNode.parentNode.parentNode.classList.contains('closed');
    if(close){
      this.renderer.removeClass(event.target.parentNode.parentNode.parentNode, 'closed');
      this.renderer.removeClass(event.target, 'fa-angle-down');
      this.renderer.addClass(event.target, 'fa-angle-up');
    }
    else{
      this.renderer.addClass(event.target.parentNode.parentNode.parentNode, 'closed');
      this.renderer.removeClass(event.target, 'fa-angle-up');
      this.renderer.addClass(event.target, 'fa-angle-down');
    }
    for(let elem of event.target.parentNode.parentNode.parentNode.children){
      if(elem.classList.contains('calendar-entry')){
        const showElem = elem.lastChild;
        if(close){
          this.renderer.removeClass(showElem, 'hidden');
          this.renderer.removeClass(elem.firstChild.lastChild.firstChild, 'fa-angle-down');
          this.renderer.addClass(elem.firstChild.lastChild.firstChild, 'fa-angle-up');
        }
        else{
          this.renderer.addClass(showElem, 'hidden');
          this.renderer.removeClass(elem.firstChild.lastChild.firstChild, 'fa-angle-up');
          this.renderer.addClass(elem.firstChild.lastChild.firstChild, 'fa-angle-down');
        }
      }
    }*/
//}
}
