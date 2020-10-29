import {Component, Input, OnInit} from '@angular/core';
import {Globals} from "../../../global/globals";
import {Client} from "../../../dtos/client";
import {Receipt} from "../../../dtos/receipt";
import {Order} from "../../../dtos/order";
import {ReceiptItem} from "../../../dtos/receipt-item";

@Component({
  selector: 'app-order-print-view',
  templateUrl: './order-print-view.component.html',
  styleUrls: ['./order-print-view.component.scss']
})
export class OrderPrintViewComponent implements OnInit {

  @Input()
  private client: Client;
  @Input()
  private receipt: Receipt;
  @Input()
  private order: Order;

  constructor(public globals: Globals) { }

  ngOnInit() {
    this.initReceipt(this.receipt);
  }

  private roundMoney(num:number):string{
    return (Math.round(num*Math.pow(10,2))/Math.pow(10,2)).toLocaleString();
  }

  private initReceiptItem(item: ReceiptItem) {
    let w = item.product.hasWidth ? item.configuration.width : 1;
    let l = item.product.hasLength ? item.configuration.length : 1;
    let h = item.product.hasHeight ? item.configuration.height : 1;

    item.itemPrice = w*l*h*item.product.pricePerUnit;
    item.gross = item.itemPrice*item.amount;
    item.vat = item.gross*this.globals.vatPercent;
    item.net = item.gross+item.vat;
  }

  private initReceipt(receipt: Receipt) {
    receipt.gross = 0;
    receipt.vat = 0;
    receipt.net = 0;
    for (let item of receipt.items) {
      this.initReceiptItem(item);
      receipt.gross += item.gross;
      receipt.vat += item.vat;
      receipt.net += item.net;
    }
    receipt.totalPrice = receipt.net - (receipt.prepayment ? receipt.prepayment : 0);
  }

  public print() {
    let printContents = document.getElementById('print-section').innerHTML;
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Order</title>
          <style>
            body {
                font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
            }
            table {
                border-collapse: collapse;
            }
            th, td {
                border: solid thin black;
                padding: 2px 5px;
            }
            thead {
                border-bottom: solid thick black;
            }
            .hide {
                border: none;
            }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
