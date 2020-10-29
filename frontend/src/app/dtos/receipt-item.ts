import {Product} from "./product";
import {ProductConfiguration} from "./productConfiguration";
import {Globals} from "../global/globals";

export class ReceiptItem {

  public itemPrice: number;
  public gross: number;
  public vat: number;
  public net: number;

  constructor(
    public amount: number,
    public product: Product,
    public configuration: ProductConfiguration,
    public globals: Globals) {}
}
