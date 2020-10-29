import { Injectable } from '@angular/core';
import {DashboardService} from "./dashboard.service";
import {Observable} from "rxjs/index";
import {DashboardDay} from "../components/dashboard/model/dashboardday";
import {UserCalendarData} from "../dtos/userCalendarData";
import {UserCalendarEntry} from "../dtos/UserCalendarEntry";
import {tap} from "rxjs/operators";
import {Globals} from "../global/globals";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserCalendarService {

  private userCalendarUrl = this.globals.backendUri + "/dashboard/user-calendar/";

  constructor(private dashboardService: DashboardService, private http: HttpClient, private globals: Globals) { }

  getData(fromDate: String, toDate: String, id: number): Observable<UserCalendarData[]>{
    return this.http.get<UserCalendarData[]>(this.userCalendarUrl + id + "?from="+fromDate+"&to="+toDate)
      .pipe(
        tap(x => console.log(x))
      );
  }

}
