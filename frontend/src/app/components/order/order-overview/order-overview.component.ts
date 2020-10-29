import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Order} from "../../../dtos/order";
import {OrderService} from "../../../services/order.service";
import {ToastrService} from "ngx-toastr";
import {OrderDetailComponent} from "../order-detail/order-detail.component";

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.scss']
})
export class OrderOverviewComponent implements OnInit {

  private listData: Order[];
  private filteredListData: Order[];
  private error: boolean;
  private errorMessage: string;
  private searchWord: String;
  private completionStates: Map<number, string>;

  constructor(private router: Router, public orderService: OrderService,  private toastr: ToastrService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh(){
    this.orderService.getAllOrders().subscribe(
      (orders: Order[]) => {
        this.listData = orders;
        this.filteredListData = orders;
        //console.log(this.listData)
      },
      (error) => this.defaultErrorHandling(error)
    );
    this.orderService.getCompletionStates().subscribe(states => {
      this.completionStates = new Map<number, string>();
      for (let state of states) {
        this.completionStates.set(state.id, state.name);
      }
    });
  }

  onAddClick() {
    this.router.navigate(["order/create1"]);
  }


  defaultErrorHandling(error: any) {
    console.log(error);
    this.error = true;
    if (error.error.message !== 'No message available') {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = error.error.error;
    }
    this.toastr.error(this.errorMessage, 'Order');
  }

  clear(){
    this.searchWord = '';
    this.filteredListData = this.listData;
  }

  filter() {
    //console.log('filter');
    let searchWord = this.searchWord.trim().toLowerCase();

    this.filteredListData = this.listData.filter((order) => {
        if ((order.id + '').toLowerCase().includes(searchWord) || (order.completionStateId + '').toLowerCase().includes(searchWord) || (order.completionStateId + '').toLowerCase().includes(searchWord)){
          return true;
        } else {
          return false;
        }
    });
  }

  getCompletionState(stateId: number): string {
    if (this.completionStates == undefined) return stateId+"";
    let name = this.completionStates.get(stateId);
    if (name == undefined) return stateId+"";
    return name;
  }

  scheduleOrder(orderId: number, plannedCompletionDate: Date){
    $("#dueDateCalculateLoading-"+orderId).show();
    this.orderService.scheduleOrder(orderId).subscribe(data => {
        //console.log(data);
        //let lastDate = this.calculateLastDate(data);
        if(data.length == 0){
          this.toastr.info("All tasks already scheduled.");
        }
        else{
          let last = OrderDetailComponent.calculateLastDate(data);

          if(new Date(new Date(last).toDateString()) > new Date(plannedCompletionDate)){
            this.toastr.warning("Order scheduled, but it will be late!");
          }
          else{
            this.toastr.info("Order scheduled successfully!");
          }

        }
        $("#dueDateCalculateLoading-"+orderId).hide();
        this.refresh();
      },
      error => {
        $("#dueDateCalculateLoading-"+orderId).hide();
        console.log(error);
        this.toastr.error("The order could not be scheduled, because: " + error.error.message);
      }
    );
  }
}
