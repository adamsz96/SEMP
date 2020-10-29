import {DashboardTask} from "./DashboardTask";
import {Skill} from "../../dtos/skill";

export class EmployeeDashboardData {

  employeeId: number;
  skills: Skill[];
  name: string;
  tasks: DashboardTask[];

}
