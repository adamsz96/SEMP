import {Task} from "./task";
import {ProductConfiguration} from "./productConfiguration";

export class ConcreteTask {
  constructor(
    public id: number,
    public task: Task,
    public plannedDuration: number,
    public productConfiguration: ProductConfiguration
  ) {}
}

