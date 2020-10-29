import {ReceiptItem} from "./receipt-item";

export class Receipt{

  public gross: number;
  public vat: number;
  public net: number;
  public totalPrice: number;

  constructor (
  public items: ReceiptItem[],
  public prepayment: number) {}
}

