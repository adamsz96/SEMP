import {ConcreteTask} from "./concreteTask";

export class ProductConfiguration {
  constructor(
    public id: number,
    public length: number,
    public height: number,
    public width: number,
    public color: String,
    public concreteTasks: ConcreteTask[],
    public productId: number,
    public info: String
  ){}
}
