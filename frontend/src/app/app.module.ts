import * as $ from 'jquery';

import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {httpInterceptorProviders} from './interceptors';
import {Globals} from './global/globals';
import {AngularFontAwesomeModule} from "angular-font-awesome";
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { ToastrModule } from 'ngx-toastr';

//material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatStepperModule} from '@angular/material/stepper';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

//components
import { ProductDetailsViewComponent } from './components/product/product-details-view/product-details-view.component';
import { ProductOverviewComponent } from './components/product/product-overview/product-overview.component';
import { ProductOverviewItemComponent } from './components/product/product-overview-item/product-overview-item.component';
import { ProductTaskViewComponent } from './components/product/product-task-view/product-task-view.component';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {LoginComponent} from './components/login/login.component';
import {MessageComponent} from './components/message/message.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {EmployeeComponent} from "./components/employee/employee.component";
import {UserCalendarComponent} from "./components/user-calendar/user-calendar.component";
import { ClientOverviewComponent } from './components/client/client-overview/client-overview.component';
import { ClientDetailViewComponent } from './components/client/client.detail.view/client.detail.view.component';
import { ClientInfoComponent } from './components/client/client-info/client-info.component';
import { ClientListComponent } from './components/client/client.list/client.list.component';
import { ClientListElementComponent } from './components/client/client.list.element/client.list.element.component';
import { ClientSearchComponent } from './components/client/client-search/client-search.component';
import { ErrorComponent } from './components/error/error/error.component';
import { PlannedTaskDetailsComponent } from './components/planned-task-details/planned-task-details.component';
import { OrderDetailComponent } from './components/order/order-detail/order-detail.component';
import { NewOrderComponent } from './components/order/new-order/new-order.component';
import { OrderOverviewComponent } from './components/order/order-overview/order-overview.component';
import { LoaderComponent } from './components/loader/loader.component';
import { EmployeeDetailsComponent } from './components/employee/employee-details/employee-details.component';
import { SkillOverviewComponent } from './components/skill/skill-overview/skill-overview.component';
import { SkillDetailComponent } from './components/skill/skill-detail/skill-detail.component';
import { ClaimComponent } from './components/order/claim/claim.component';
import { DashboardEmployeeComponent } from './components/dashboard/dashboard-employee/dashboard-employee.component';
import { DashboardDayComponent } from './components/dashboard/dashboard-day/dashboard-day.component';
import { DashboardOrderComponent } from './components/dashboard/dashboard-order/dashboard-order.component';
import { AddTaskComponent } from './components/dashboard/addtask/addtask.component';
import {identifierModuleUrl} from "@angular/compiler";
import {OrderScheduleTableComponent} from "./components/order/order-schedule-table/order-schedule-table.component";
import {OrderPrintViewComponent} from "./components/order/order-print-view/order-print-view.component";
import {OrderCostTableComponent} from "./components/order/order-cost-table/order-cost-table.component";
import { FreeComponent } from './components/employee/free/free.component';

registerLocaleData(localeDe);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    MessageComponent,
    ProductDetailsViewComponent,
    ProductOverviewComponent,
    ProductOverviewItemComponent,
    ProductTaskViewComponent,
    EmployeeComponent,
    ClientOverviewComponent,
    DashboardComponent,
    SidebarComponent,
    ClientDetailViewComponent,
    ClientListComponent,
    ClientListElementComponent,
    ClientInfoComponent,
    ClientSearchComponent,
    UserCalendarComponent,
    ErrorComponent,
    OrderDetailComponent,
    NewOrderComponent,
    OrderOverviewComponent,
    LoaderComponent,
    PlannedTaskDetailsComponent,
    EmployeeDetailsComponent,
    SkillOverviewComponent,
    SkillDetailComponent,
    ClaimComponent,
    SkillDetailComponent,
    DashboardEmployeeComponent,
    DashboardDayComponent,
    DashboardOrderComponent,
    AddTaskComponent,
    OrderScheduleTableComponent,
    OrderPrintViewComponent,
    OrderCostTableComponent,
    FreeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatListModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ToastrModule.forRoot({
        timeOut: 10000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false
      }),
  ],
  providers: [
    httpInterceptorProviders,
    Globals,
    {provide: LOCALE_ID, useValue: "de-at"}
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddTaskComponent]
})
export class AppModule {
}
