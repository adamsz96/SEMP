import {DashboardEmployee} from "./dashboardemployee";

export class DashboardDay{
  day: Date;
  employees: Map<number, DashboardEmployee>;
}
