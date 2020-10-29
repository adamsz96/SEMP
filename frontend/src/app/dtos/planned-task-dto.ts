export class PlannedTaskDto {
    id: number;
    plannedDate: Date;
    plannedDuration: number;
    employeeId: number;
    concreteTaskId: number;
    productName: string;
    productId: number;

    constructor(id?: number, plannedDate?: Date, plannedDuration?: number, employeeId?: number, concreteTaskId?: number, productName?: string, productId?: number) {
      this.id = id;
      this.plannedDate = plannedDate;
      this.plannedDuration = plannedDuration;
      this.employeeId = employeeId;
      this.concreteTaskId = concreteTaskId;
      this.productId = productId;
      this.productName = productName;
    }
  }
