import {ProductConfiguration} from "./productConfiguration";
import {Employee} from "./employee";
import {Client} from "./client";
import {Claim} from "./claim";

export class Order {

  constructor(
    public id: number,
    public employee: Employee,
    public customer: Client,
    public claim: Claim,
    public completionStateId: number,
    public paid: boolean,
    public prepayment: number,
    public startDate: Date,
    public plannedCompletionDate: Date,
    public scheduledDate: Date,
    public infos: String,
    public productConfigurations: ProductConfiguration[]
  ) {
  }
}
