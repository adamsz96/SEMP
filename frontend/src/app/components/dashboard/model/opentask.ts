import { Skill } from 'src/app/dtos/skill';

export class OpenTask{

  taskId: number;
  productName: String;
  taskName: String;
  orderName: String;
  plannedDuration: number;
  skill: Skill;
  parentTasks: number[];
  
  /*constructor(plannedDuration?: number) {
    this.plannedDuration = plannedDuration;
  }*/

  constructor(taskId?: number, productName?: String, taskName?: String, orderName?: String, plannedDuration?: number,
    skill?: Skill, parentTasks?: number[]) {
    this.taskId = taskId;
    this.productName = productName;
    this.taskName = taskName;
    this.orderName = orderName;
    this.plannedDuration = plannedDuration;
    this.skill = skill;
    this.parentTasks = parentTasks;
  }

  

}
