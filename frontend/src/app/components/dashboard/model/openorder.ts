import {OpenTask as OpenTask} from './opentask';

export class OpenOrder {
  orderId: number;
  orderName: string;
  selectedTaskId: number;

  tasks: OpenTask[];

  constructor(orderId?: number, orderName?: string, tasks?: any) {
    if(orderId) {
      this.orderId = orderId;
    }
    if(orderName) {
      this.orderName = orderName;
    }
    if(tasks) {
      this.tasks = tasks;
    }
    this.selectedTaskId = -1;
  }
}
