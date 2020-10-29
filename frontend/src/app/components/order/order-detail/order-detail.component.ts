import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import{Order} from "../../../dtos/order";
import {Employee} from "../../../dtos/employee";
import {EmployeeService} from "../../../services/employee.service";
import {ClientService} from "../../../services/client.service";
import {ProductService} from "../../../services/product.service";
import {Client} from "../../../dtos/client";
import {PlannedTaskDto} from "../../../dtos/planned-task-dto";
import {OrderSchedule} from "../../../dtos/orderSchedule";
import {ToastrService} from "ngx-toastr";
import {ReceiptItem} from "../../../dtos/receipt-item";
import {Receipt} from "../../../dtos/receipt";
import {OrderPrintViewComponent} from "../order-print-view/order-print-view.component";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router:Router,
              public orderService: OrderService,
              private employeeService:EmployeeService,
              private clientService:ClientService,
              private productService:ProductService,
              private toastr: ToastrService) { }

  @Input()
  public order:Order;
  public client:Client;
  public employee:Employee;
  private error: boolean;
  private errorMessage: string;
  public receipt: Receipt;
  private scheduleData:  OrderSchedule[];
  private scheduledDate: Date;
  private isLate: boolean = false;

  private completionStates: Map<number, string>;

  @ViewChild('printTable')
  private printTable: OrderPrintViewComponent;

  ngOnInit() {
    this.orderService.getCompletionStates().subscribe((completionStates) => {
      this.completionStates = new Map<number, string>();
      for (let completionState of completionStates) {
        this.completionStates.set(completionState.id,completionState.name);
      }
    });

    this.getOrder();
  }

  defaultServiceErrorHandling(error: any) {
    console.log(error);
    this.error = true;
    if (error.error.message !== 'No message available') {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = error.error.error;
    }
  }

  print() {
    this.printTable.print();
  }

  onEmployeeClick():void{
    this.router.navigate(['employee/'+this.employee.id]);
  }

  onCustomerClick(client:Client):void{
    this.clientService.remove = false;
    this.clientService.client = client;
    this.router.navigate(['client/info'])
  }

  onClaimClick():void{
    this.router.navigate(['claim/'+this.order.claim])
  }

  onProductClick(productId:number) {
    this.router.navigate(['product/'+productId])
  }

  getState(id: number):string {
    return this.completionStates.get(id);
  }

  scheduleOrder(){
    this.orderService.scheduleOrder(this.order.id).subscribe(data => {
        //console.log(data);
        //let lastDate = this.calculateLastDate(data);
        if(data.length == 0){
          this.toastr.info("All tasks already scheduled.");
        }
        else{
          let last = OrderDetailComponent.calculateLastDate(data);

          if(new Date(new Date(last).toDateString()) > new Date(this.order.plannedCompletionDate)){
            this.toastr.warning("Order scheduled, but it will be late!");
          }
          else{
            this.toastr.info("Order scheduled successfully!");
          }
          this.getOrder();
          this.getScheduleInfo();
        }
      },
      error => {
        console.log(error);
        this.toastr.error("The order could not be scheduled, because: " + error.error.message);
      }
    );
  }

  public static calculateLastDate(plannedTasks: PlannedTaskDto[]): Date{
    if(plannedTasks.length == 0){
      return null;
    }
    else{
      let maxDate = plannedTasks[0].plannedDate;
      for(let plannedTask of plannedTasks){
        if(plannedTask.plannedDate > maxDate){
          maxDate = plannedTask.plannedDate;
        }
      }

      return maxDate;
    }
  }

  getOrder(){
    const id =+this.route.snapshot.paramMap.get('id');
    //console.log("getting order with id:"+id);
    this.orderService.findOneOrderById(id).subscribe((order:Order)=>{
      this.order=order;
      this.orderService.getReceiptForOrderWithId(order.id).subscribe((receiptItems: ReceiptItem[]) => {
        this.receipt = new Receipt(receiptItems,order.prepayment);
      });
      this.getEmployee();
      this.getClient();
      this.getScheduleInfo();
    },error => {
      this.defaultServiceErrorHandling(error);
    });

  }

  getEmployee(){
    //console.log("get employee with id"+this.order.employeeId);
    this.employeeService.getEmployeeById(this.order.employee.id).subscribe((employee:Employee)=>{
      this.employee=employee;
    },error => {
      this.defaultServiceErrorHandling(error);
    });
  }

  getClient(){
   this.clientService.fintOneById(this.order.customer.id).subscribe((customer:Client)=>{
     //console.log("Get client with id "+this.order.customerId);
      this.client=customer;
    },error => {
      this.defaultServiceErrorHandling(error);
    });
  }

  getScheduleInfo(){
    //console.log("Getting scheduling info...");
    //console.log(this.order);
    this.orderService.getScheduledInfoForOrder(this.order.id).subscribe(data => {
        this.scheduleData = data;
        this.getLastScheduledDate();
    },
      error => {
        this.toastr.error("Could not get scheduling information, beacuse: " + error.error.message);
      })
  }

  getLastScheduledDate() {
    //console.log("getLastScheduledDate...");
    let last:Date = null;

    for(let task of this.scheduleData){
      if(task.employeeId != -1){
        if(last == null || new Date(task.startOfTask) > new Date(last)){
          last = task.startOfTask;
        }
      }
    }

    this.isLate = new Date(new Date(last).toDateString()) > new Date(this.order.plannedCompletionDate);
    this.scheduledDate = last;
  }

  completeOrder(){
    this.orderService.completeOrder(this.order.id).subscribe(data =>{
        this.toastr.success("Successfully completed the order!");
        this.getOrder();
    },
      error =>{
        this.toastr.error("Could not complete order, beacuse: " + error.error.message);
      })

  }

  paymentReceived(){
    this.orderService.paymentReceived(this.order.id).subscribe(data => {
      this.toastr.success("Successfully updated the payment status!");
      this.getOrder();
    },
      error =>{
        this.toastr.error("Could not update the payment status, beacuse: " + error.error.message);
      });
  }

}
