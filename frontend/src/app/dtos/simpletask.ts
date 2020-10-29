export class SimpleTask{
  constructor (
      public id: number,
      public name: string,
      public allocatedTime: number,
      public skill: string,
      public parentTasks: SimpleTask[]
  ) {}
}
