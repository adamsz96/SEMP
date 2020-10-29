import { Injectable } from '@angular/core';
import {Order} from "../dtos/order";
import {HttpClient} from "@angular/common/http";
import {Globals} from "../global/globals";
import {Observable} from "rxjs";
import {Product} from "../dtos/product";
import {Claim} from "../dtos/claim";
import {Receipt}from"../dtos/receipt"
import {PlannedTaskDto} from "../dtos/planned-task-dto";
import {OrderSchedule} from "../dtos/orderSchedule";
import {ReceiptItem} from "../dtos/receipt-item";
import {CompletionState} from "../dtos/completion-state";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderBaseUrl: string = this.globals.backendUri + '/order';

  constructor(private httpClient: HttpClient, private globals: Globals) { }

  findOneOrderById(id: number): Observable<Order> {
    console.log('Get order with ID: ' + id);

    return this.httpClient.get<Order>(this.orderBaseUrl + '/' + id);
  };

  getAllOrders(): Observable<Order[]> {
    console.log('Get all orders');

    return this.httpClient.get<Order[]>(this.orderBaseUrl);
  }

  deleteOrder(id: number): void {
    console.log('Delete order with ID: '+id);

    this.httpClient.delete(this.orderBaseUrl + '/delete/' +id);
  }

  saveOrder(order: Order): Observable<Order> {
    console.log('Save order');

    return this.httpClient.post<Order>(this.orderBaseUrl, order);
  };

  calculateDueDate(order: Order): Observable<Date>{
    return this.httpClient.post<Date>(this.orderBaseUrl+"/calculate-due-date", order);
  }

  findOneClaimById(id: number): Observable<Claim> {
    console.log('Get claim with ID: ' + id);

    return this.httpClient.get<Claim>(this.orderBaseUrl + '/claim/' + id);
  };

  getAllClaims(): Observable<Claim[]> {
    console.log('Get all claims');

    return this.httpClient.get<Claim[]>(this.orderBaseUrl + '/claim');
  };

  saveClaimForOrderWithId(claim: Claim, id: number): Observable<Order> {
    console.log('Save claim for order with ID: ' + id);

    return this.httpClient.post<Order>(this.orderBaseUrl + '/claim/' + id, claim);
  };

  getReceiptForOrderWithId(id:number): Observable<ReceiptItem[]>{
    console.log('Get receipt for order with Id: '+id);
    return this.httpClient.get<ReceiptItem[]>(this.orderBaseUrl+'/receipt/'+id);
  }

  scheduleOrder(id: number): Observable<PlannedTaskDto[]>{

    return this.httpClient.post<PlannedTaskDto[]>(this.orderBaseUrl+"/schedule/"+id, null);
  }

  getScheduledInfoForOrder(id: number): Observable<OrderSchedule[]>{
    return this.httpClient.get<OrderSchedule[]>(this.orderBaseUrl+"/schdedule-details/" + id);
  }

  getCompletionStates(): Observable<CompletionState[]> {
    return this.httpClient.get<CompletionState[]>(this.orderBaseUrl+"/completionState");
  }

  completeOrder(orderId: number): Observable<{}>{
    return this.httpClient.put<{}>(this.orderBaseUrl+"/"+orderId+"/setCompletionState/4", null);
  }

  paymentReceived(orderId: number): Observable<{}>{
    return this.httpClient.put<{}>(this.orderBaseUrl+"/"+orderId+"/payment", {received: true});
  }

}
