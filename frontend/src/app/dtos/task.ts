import {Skill} from "./skill";
import {Product} from "./product";


export class Task{
  constructor (
      public id: number,
      public name: string,
      public allocatedTime: number,
      public skill: Skill,
      public parentTasks: Task[],
      public product: Product
  ) {}
}
