import {Component, Input, OnInit, Output} from '@angular/core';
import {OrderSchedule} from "../../../dtos/orderSchedule";

@Component({
  selector: 'app-order-schedule-table',
  templateUrl: './order-schedule-table.component.html',
  styleUrls: ['./order-schedule-table.component.scss']
})
export class OrderScheduleTableComponent implements OnInit {

  @Input()
  private scheduleData: OrderSchedule[];
  @Input()
  public scheduledDate: Date;
  @Input()
  private plannedCompletionDate: Date;

  private showAllSchedules: boolean = false;

  constructor() { }

  ngOnInit() {}


  showAllSchedulesClick() {
    this.showAllSchedules = true;
  }

  hideSchedules() {
    this.showAllSchedules = false;
  }

}
