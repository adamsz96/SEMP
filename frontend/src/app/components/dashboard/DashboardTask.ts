import {Skill} from "../../dtos/skill";

export class DashboardTask{

  plannedTaskId: number;
  plannedDate: Date;
  plannedDuration: number;
  productName: String;
  taskName: String;
  orderName: String;
  requiredSkill: Skill;

}
