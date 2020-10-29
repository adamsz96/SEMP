import { Component, OnInit, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { DashboardDay } from '../model/dashboardday';
import { DeletePlannedTaskEvent } from '../model/deleteplannedtask.event';
import { OpenTask } from '../model/opentask';

@Component({
  selector: 'app-dashboard-day',
  templateUrl: './dashboard-day.component.html',
  styleUrls: ['./dashboard-day.component.scss']
})
export class DashboardDayComponent implements OnInit, OnChanges {

  @Input() entry: DashboardDay;
  @Input() currentActiveTask: OpenTask = new OpenTask(0);
  @Input() selectMode: boolean = false;
  @Output() private createPlannedTaskEvent = new EventEmitter<string>();
  @Output() private deletePlannedTaskEvent = new EventEmitter<DeletePlannedTaskEvent>();
  public hidden = true;
  constructor() { }

  ngOnInit() {
  }

  isToday(date: string){
    let d = new Date(date);
    return d.toDateString() == (new Date()).toDateString();
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    // this.calculateLongestBrake();
  }

  toggleAll(event: any){
    if(this.hidden === true) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }

  deletePlannedTask(): void{
    this.deletePlannedTaskEvent.emit(new DeletePlannedTaskEvent());
  }

  createPlannedTask(event: string): void {
    this.createPlannedTaskEvent.emit(event);
  }

}
