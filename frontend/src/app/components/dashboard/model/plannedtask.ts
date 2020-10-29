export class PlannedTask{
  plannedTaskId: number;
  concreteTaskId: number;
  plannedDate: Date;
  plannedDuration: number;
  productName: String;
  taskName: String;
  orderName: String;

  constructor(plannedTaskId?: number, concreteTaskId?:number, plannedDate?: Date, plannedDuration?: number, productName?: String,
                taskName?: String, orderName?: String) {
    this.plannedTaskId = plannedTaskId;
    this.concreteTaskId = concreteTaskId;
    this.plannedDate = plannedDate;
    this.plannedDuration = plannedDuration;
    this.productName = productName;
    this.taskName = taskName;
    this.orderName = orderName;
  }
}
