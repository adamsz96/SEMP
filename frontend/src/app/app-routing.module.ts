import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {AuthenticationGuard} from './guards/authentication.guard';
import {LoggedInGuard} from './guards/logged-in.guard';
import {EmployeeComponent} from './components/employee/employee.component';
import {OrderOverviewComponent} from './components/order/order-overview/order-overview.component';
import {ProductDetailsViewComponent} from "./components/product/product-details-view/product-details-view.component";
import {ProductOverviewComponent} from "./components/product/product-overview/product-overview.component";
import {ClientOverviewComponent} from './components/client/client-overview/client-overview.component';
import {EmployeeGuard} from "./guards/employee.guard";
import {ManagerGuard} from "./guards/manager.guard";
import {ClientDetailViewComponent} from './components/client/client.detail.view/client.detail.view.component';
import { ClientInfoComponent } from './components/client/client-info/client-info.component';
import {UserCalendarComponent} from "./components/user-calendar/user-calendar.component";
import {ErrorComponent} from "./components/error/error/error.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {NewOrderComponent} from "./components/order/new-order/new-order.component";
import {OrderDetailComponent} from "./components/order/order-detail/order-detail.component";
import {PlannedTaskDetailsComponent} from "./components/planned-task-details/planned-task-details.component";
import {EmployeeDetailsComponent} from "./components/employee/employee-details/employee-details.component";
import {SkillOverviewComponent} from "./components/skill/skill-overview/skill-overview.component";
import {SkillDetailComponent} from "./components/skill/skill-detail/skill-detail.component";
import {ClaimComponent} from "./components/order/claim/claim.component";
import {FreeComponent} from "./components/employee/free/free.component";


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'order/new', canActivate: [AuthenticationGuard, EmployeeGuard], component: NewOrderComponent},
  {path:'claim/:id', canActivate:[AuthenticationGuard, EmployeeGuard],component: ClaimComponent},
  {path: 'order/:id',canActivate: [AuthenticationGuard,EmployeeGuard], component:OrderDetailComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'employee', canActivate: [AuthenticationGuard, EmployeeGuard], component: EmployeeComponent},
  {path: 'employee/:id/free', canActivate: [AuthenticationGuard, EmployeeGuard], component: FreeComponent},
  {path: 'employee/:id', canActivate: [AuthenticationGuard, EmployeeGuard], component: EmployeeDetailsComponent},
  {path: 'employee/new', canActivate: [AuthenticationGuard, EmployeeGuard], component: EmployeeDetailsComponent},
  {path: 'skills', canActivate: [AuthenticationGuard, EmployeeGuard], component: SkillOverviewComponent},
  {path: 'skills/new', canActivate: [AuthenticationGuard, EmployeeGuard], component: SkillDetailComponent},
  {path: 'client', canActivate: [AuthenticationGuard, EmployeeGuard], component: ClientOverviewComponent},
  {path: 'client/new', canActivate: [AuthenticationGuard, EmployeeGuard], component: ClientDetailViewComponent},
  {path: 'client/edit/:id', canActivate: [AuthenticationGuard, EmployeeGuard], component: ClientDetailViewComponent},
  {path: 'client/info', canActivate: [AuthenticationGuard, EmployeeGuard], component: ClientInfoComponent},
  {path: 'order', canActivate: [AuthenticationGuard, EmployeeGuard], component: OrderOverviewComponent},
  {path: 'order/new', canActivate: [AuthenticationGuard, EmployeeGuard], component: NewOrderComponent},
  {path: 'product', canActivate: [AuthenticationGuard, EmployeeGuard], component: ProductOverviewComponent},
  {path: 'product/:id', canActivate: [AuthenticationGuard, EmployeeGuard], component: ProductDetailsViewComponent},
  {path: 'product/new', canActivate: [AuthenticationGuard, EmployeeGuard], component: ProductDetailsViewComponent},
  {path: "user-calendar/:id",  canActivate: [AuthenticationGuard], component: UserCalendarComponent},
  {path: "planned-task-details/:id", canActivate:[AuthenticationGuard, EmployeeGuard], component: PlannedTaskDetailsComponent},
  {path: '**', canActivate:[EmployeeGuard],component: ErrorComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
