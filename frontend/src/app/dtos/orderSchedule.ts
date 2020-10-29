export class OrderSchedule {

  constructor (
    public productId: number,
    public productName: string,

    public concreteTaskId: number,
    public taskName: string,

    public employeeId: number,
    public employeeName: string,

    public startOfTask: Date,
    public taskDuration: number

    ) {}
}
