import {Component, Input, OnInit} from '@angular/core';
import {Receipt} from "../../../dtos/receipt";
import {Globals} from "../../../global/globals";
import {ReceiptItem} from "../../../dtos/receipt-item";

@Component({
  selector: 'app-order-cost-table',
  templateUrl: './order-cost-table.component.html',
  styleUrls: ['./order-cost-table.component.scss']
})
export class OrderCostTableComponent implements OnInit {

  @Input()
  private receipt: Receipt;

  constructor(
    public globals: Globals
  ) { }

  ngOnInit() { }

  private roundMoney(num:number):string{
    return (Math.round(num*Math.pow(10,2))/Math.pow(10,2)).toLocaleString();
  }

  public totalItemPrice(item: ReceiptItem): number {
    let width = item.product.hasWidth ? item.configuration.width : 1;
    let height = item.product.hasHeight ? item.configuration.height : 1;
    let length = item.product.hasLength ? item.configuration.length : 1;

    return item.product.pricePerUnit*width*height*length*item.amount;
  }

  public grossPrice(): number {
    let gross = 0;
    for (let item of this.receipt.items) {
      gross += this.totalItemPrice(item);
    }
    return gross;
  }

  public vatPrice(): number {
    return this.grossPrice()*this.globals.vatPercent;
  }

  public netPrice(): number {
    return this.grossPrice()+this.vatPrice();
  }

  public totalPrice(): number {
    return this.netPrice()-(this.receipt.prepayment?this.receipt.prepayment:0);
  }
}
