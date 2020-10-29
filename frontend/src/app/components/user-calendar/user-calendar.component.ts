import { Component, OnInit } from '@angular/core';
import {DashboardDay} from "../dashboard/model/dashboardday";
import {formatDate} from "@angular/common";
import {UserCalendarService} from "../../services/user-calendar.service";
import {DashboardService} from "../../services/dashboard.service";
import {UserCalendarData} from "../../dtos/userCalendarData";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-calendar',
  templateUrl: './user-calendar.component.html',
  styleUrls: ['./user-calendar.component.scss']
})
export class UserCalendarComponent implements OnInit {

  blocks: number[];
  data: UserCalendarData[];

  fromDate: Date;
  toDate: Date;

  id: number;

  constructor(private userCalendarService: UserCalendarService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.initBlocks();
    this.initDates();
    this.route.params.subscribe(params => {
      console.log(params); //log the entire params object
      console.log(params['id']); //log the value of id
      this.id = params['id'];
    });
    this.getData();
  }

  initDates(){
    this.fromDate = new Date();
    this.calcToDate();
  }

  calcToDate(){
    this.toDate = new Date();
    this.toDate.setDate(this.fromDate.getDate()+5);
  }

  calculateTopPx(begin: number): number{
    return ((begin+1) * 20);
  }

  calculateHeightPx(duration: number): number{
    return ((duration) * 20);
  }

  initBlocks(){
    this.blocks = Array(8*4).fill(1);
    let i: number = 0;
    while(i < 9*4){
      this.blocks[i] = i;
      i++;
    }
  }

  getData(){
    this.userCalendarService.getData(formatDate(this.fromDate, "yyyy-MM-dd", "en-US"),
      formatDate(this.toDate, "yyyy-MM-dd", "en-US"), this.id).subscribe(data => this.data = data);
  }

}
