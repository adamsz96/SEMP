
export class PlannedTaskDetailsDto {
  constructor (
    public plannedTaskId: number,
    public taskName: string,
    public taskDescription: string,
    public plannedTaskDuration: number,
    public productName: string,
    public productId: number,
    public employeeId: number) {}
}
