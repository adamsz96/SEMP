import {Task} from "./task";

export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public hasLength: boolean,
    public hasHeight: boolean,
    public hasWidth: boolean,
    public hasColor: boolean,
    public pricePerUnit: number,
    public images: string[],
    public tasks: Task[]) {
  }
}
