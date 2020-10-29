import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Client} from "../../../dtos/client";
import {ClientService} from "../../../services/client.service";
import {Order} from "../../../dtos/order";
import {ConcreteTask} from "../../../dtos/concreteTask";
import {ProductService} from "../../../services/product.service";
import {Product} from "../../../dtos/product";
import {OrderService} from "../../../services/order.service";
import {Router} from "@angular/router";
import {ProductConfiguration} from "../../../dtos/productConfiguration";

import {AuthenticationService} from "../../../services/authentication.service";
import {EmployeeService} from "../../../services/employee.service";
import {TaskService} from "../../../services/task.service";
import {ToastrService} from 'ngx-toastr'
import {Employee} from "../../../dtos/employee";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Receipt} from "../../../dtos/receipt";
import {ReceiptItem} from "../../../dtos/receipt-item";
import {CompletionState} from "../../../dtos/completion-state";
import {zip} from "rxjs";

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {
  private clientList: Client[];
  private productList: Product[];
  private clientForm: FormGroup;
  private orderForm: FormGroup;

  private newClient: Client;
  private newOrder: Order;
  private newProductConfigurations: ProductConfiguration[] = [];
  private newConcreteTasks: ConcreteTask[] = [];
  private employee: Employee;

  private error: boolean;
  private errorMessage: string;
  private toDelete: number;

  private checkClient = false;
  private checkOrder = false;
  private model: NgbDate;
  private dateInThePast = false;

  private minDate: NgbDate;

  private completionStates: CompletionState[];
  private completionStatesMap: Map<number, string>;

  private selectedClient: Client;
  private oldFilter;
  private skipOnClientSearch: number = 0;
  private touched: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private clientService: ClientService,
              private productService: ProductService,
              private orderService: OrderService,
              private taskService: TaskService,
              private employeeService: EmployeeService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private toastr: ToastrService) {}

  ngOnInit() {
    this.orderService.getCompletionStates().subscribe((states) => {
      this.completionStatesMap = new Map<number, string>();
      for (let state of states) {
        this.completionStatesMap.set(state.id, state.name);
      }
      this.completionStates = states;

      let date = new Date();

      this.minDate = NgbDate.from({year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()})

      date.setDate(date.getDate() + 7);

      this.orderForm = this.formBuilder.group({
        completionState: [this.completionStates[0].name, []],
        paid: ['no', []],
        prepayment: [0, [Validators.required, Validators.pattern("^\\d{0,4}$")]],
        plannedCompletionDate: [[Validators.required, Validators.pattern("^d{4}-(0\\d|1[012])-([012]\\d|3[01])")]],
        productConfigurations: this.formBuilder.array([]),
        info: ['', []]
      });

      this.model = NgbDate.from({year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()})
    });

    this.clientService.getAllClients().subscribe(
      (clients: Client[]) => this.clientList = clients,
      (error) => this.defaultErrorHandling(error)
    );

    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.productList = products
      },
      (error) => this.defaultErrorHandling(error)
    );

    this.employeeService.getEmployeeById(1).subscribe(
      (employee: Employee) => {
        this.employee = employee
      },
      (error) => this.defaultErrorHandling(error)
    );

    this.clientForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[^\\d\\s]*$')]],
      surname: ['', [Validators.required, Validators.pattern('^[^\\d\\s]*$')]],
      phone: ['', [Validators.pattern("^[+]?\\d*$")]],
      eMail: ['', [Validators.email]],
      street: ['', [Validators.required, Validators.pattern('^[^\\d\\s]*$')]],
      city: ['', [Validators.required, Validators.pattern('^[^\\d\\s]*$')]],
      nr: ['', [Validators.required, Validators.pattern("^\\d*$")]],
      country: ['', [Validators.required, Validators.pattern('^[^\\d\\s]*$')]],
      door: ['', [Validators.pattern("^\\d*$")]],
      zip: ['', [Validators.required, Validators.pattern("^\\d*$")]],
      info: ['', []]
    });
  }

  checkDate() {
    if (this.model != null) {
      let now = new Date();
      now.setHours(0, 0, 0, 0);
      let date = new Date(this.model.year, this.model.month - 1, this.model.day);

      if (date < now) {
        this.dateInThePast = true;
        this.orderForm.controls['plannedCompletionDate'].setErrors({'pastDate': true});
      } else {
        this.dateInThePast = false;
        this.orderForm.controls['plannedCompletionDate'].setErrors(null);
      }
    } else {
      this.dateInThePast = false;
      this.orderForm.controls['plannedCompletionDate'].setErrors(null);
    }
  }

  get getProductConfigurations() {
    return this.orderForm.get('productConfigurations') as FormArray;
  }

  addProductConfiguration() {
    const productConfiguration = this.formBuilder.group({
      type: ['', [Validators.required]],
      length: ['1', [Validators.required, Validators.pattern("^[1-9]\\d?$")]],
      height: ['1', [Validators.required, Validators.pattern("^[1-9]\\d?$")]],
      width: ['1', [Validators.required, Validators.pattern("^[1-9]\\d?$")]],
      color: ['Rot', [Validators.required, Validators.pattern('^[^\\d\\s]*$')]],
      amount: ['1', [Validators.required, Validators.max(30), Validators.min(1), Validators.pattern('^[^\d\s]*$')]],
      concreteTasks: this.formBuilder.array([]),
      productId: ['', []],
      info: ['', []],
    });

    this.getProductConfigurations.push(productConfiguration);
  }

  getConcreteTasksForIndex(index) {
    return this.getProductConfigurations.at(index).get('concreteTasks') as FormArray;
  }

  addConcreteTaskForIndex(index, size) {

    let anz = this.getConcreteTasksForIndex(index).length;
    for (let i = 0; i < anz; i++) {
      this.getConcreteTasksForIndex(index).removeAt(0);
    }

    for (let i = 0; i < size; i++) {
      let concreteTask = this.formBuilder.group({
        plannedDuration: [(this.getProduct(this.getProductConfigurations.at(index)).tasks[i].allocatedTime / 4).toFixed(2), [Validators.required, Validators.max(9)]]
      });
      this.getConcreteTasksForIndex(index).push(concreteTask);
    }
  }

  deleteProductConfiguration(i: number) {
    this.getProductConfigurations.removeAt(i);
    this.closeDialog();
  }

  setProductIDForConfig(e, i: number) {
    let selected = this.productList.filter(product => product.name === e.target.value);
    this.getProductConfigurations.at(i).patchValue({productId: selected[0].id});
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

  getProduct(productConfig) {
    if (productConfig.value.productId === '') {
      return new Product(null, null, null, false, false, false, false, null, null, null);
    }
    return this.productList.filter((specificProduct) => specificProduct.id === productConfig.value.productId)[0];
  }

  checkClientForm() {
    this.checkClient = true;
  }

  checkOrderForm() {
    this.checkOrder = true;
  }

  createClient() {
    if (this.selectedClient) this.newClient = this.selectedClient;
    else this.newClient = this.clientFromForm();
  }

  createOrder() {
    let i = 0;
    for (let productConfig of this.getProductConfigurations.controls) {
      let taskInd = 0;
      for (let concreteTask of this.getConcreteTasksForIndex(i).controls) {
        let newConcreteTask = new ConcreteTask(
          null,
          this.getProduct(productConfig).tasks[taskInd],
          concreteTask.get('plannedDuration').value * 4,
          null,
        );
        this.newConcreteTasks.push(newConcreteTask)
        taskInd++;
      }

      for (let k = 0; k < productConfig.get('amount').value; k++) {
        let newProductConfiguration = new ProductConfiguration(
          null,
          productConfig.get('length').value,
          productConfig.get('height').value,
          productConfig.get('width').value,
          productConfig.get('color').value,
          this.newConcreteTasks,
          productConfig.get('productId').value,
          productConfig.get('info').value
        );
        this.newProductConfigurations.push(newProductConfiguration);
      }
      this.newConcreteTasks = [];
      i++;
    }

    let completionStateSelect: any = $("#completionStateSelect").get(0);
    let completionStateId = parseInt(completionStateSelect.selectedOptions[0].id);

    let date = new Date(this.model.year, this.model.month - 1, this.model.day);
    this.newOrder = new Order(
      null,
      this.employee,
      this.newClient,
      null,
      completionStateId,
      this.orderForm.get("paid").value !== 'no',
      this.orderForm.get("prepayment").value === '' ? 0 : this.orderForm.get("prepayment").value,
      null,
      date,
      null,
      this.orderForm.get("info").value,
      this.newProductConfigurations,
    );

  }

  private anyErrors(): boolean {
    for (let productConfig of this.getProductConfigurations.controls) {
      if (productConfig.get('type').errors) return true;
      if (productConfig.get('amount').errors) return true;
      if (productConfig.get('height').errors) return true;
      if (productConfig.get('width').errors) return true;
      if (productConfig.get('length').errors) return true;
      if (productConfig.get('color').errors) return true;
      if (productConfig.get('type').errors) return true;
      let concreteTasks = productConfig.get('concreteTasks') as FormArray;
      for (let concreteTask of concreteTasks.controls) {
        if (concreteTask.errors) return true;
      }
    }

    if (this.clientForm.get('name').errors) return true;
    if (this.clientForm.get('surname').errors) return true;
    if (this.clientForm.get('phone').errors) return true;
    if (this.clientForm.get('eMail').errors) return true;
    if (this.clientForm.get('street').errors) return true;
    if (this.clientForm.get('country').errors) return true;
    if (this.clientForm.get('nr').errors) return true;
    if (this.clientForm.get('city').errors) return true;
    if (this.clientForm.get('zip').errors) return true;

    if (this.orderForm.get('prepayment').errors) return true;
    if (this.orderForm.get('plannedCompletionDate').errors) return true;

    return false;
  }

  calculateDueDate() {
    if (!this.anyErrors() && this.getProductConfigurations.length > 0) {
      this.createClient();
      this.createOrder();

      $("#dueDateCalculateBtn").attr("disabled", "");
      $("#dueDateCalculateLoading").show();

      this.orderService.calculateDueDate(this.newOrder).subscribe(
        (dueDate) => {
          let date = new Date(dueDate);
          this.model = NgbDate.from({year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()})
          //this.newOrder = null;
          this.newClient = null;
          this.newProductConfigurations = [];
          this.newConcreteTasks = [];
          $("#dueDateCalculateBtn").removeAttr("disabled");
          $("#dueDateCalculateLoading").hide();

        },
        error => {
          alert("ERROR: " + error.error.message);
          $("#dueDateCalculateLoading").hide();
        });
    }
  }

  addOrder() {
    this.createClient();
    this.createOrder();

    this.orderService.saveOrder(this.newOrder).subscribe(
      (newOrderWithID) => {
        this.newOrder = newOrderWithID;
        this.toastr.success('New Order created!', 'Order');
        this.router.navigate(['/dashboard']);

        this.newOrder = null;
        this.newClient = null;
        this.newProductConfigurations = [];
        this.newConcreteTasks = [];
      },

      (error) => {
        this.newOrder = null;
        this.newClient = null;
        this.newProductConfigurations = [];
        this.newConcreteTasks = [];
        this.defaultErrorHandling(error)

      }
    );
  }

  get asReceipt(): Receipt {
    let items: ReceiptItem[] = [];

    for (let productConfig of this.getProductConfigurations.controls) {
      let amount = productConfig.get('amount').value;

      let length = productConfig.get('length').value;
      let height = productConfig.get('height').value;
      let width = productConfig.get('width').value;
      let color = productConfig.get('color').value;
      let productId = productConfig.get('productId').value;
      let info = productConfig.get('info').value;

      let product = this.getProduct(productConfig);

      let configuration = new ProductConfiguration(
        null, length, height, width, color, null, productId, info
      )
      let newItem = new ReceiptItem(amount, product, configuration, null);
      items.push(newItem);
    }
    return new Receipt(items, this.orderForm.get("prepayment").value);
  }

  showProductDialog(toDelete: number,) {
    this.toDelete = toDelete;
    $("#product_delete_dialog").show();
  }

  closeDialog() {
    $("#product_delete_dialog").hide();
  }

  private clientFromForm(): Client {
    let formName: string = this.clientForm.get('name').value;
    let formSurname: string = this.clientForm.get('surname').value;
    let phone: string = this.clientForm.get('phone').value;
    let email: string = this.clientForm.get('eMail').value;
    let formStreet: string = this.clientForm.get('street').value;
    let formCountry: string = this.clientForm.get('country').value;
    let formNr: string = this.clientForm.get('nr').value;
    let formDoor: string = this.clientForm.get('door').value;
    let formCity: string = this.clientForm.get('city').value;
    let formZip: string = this.clientForm.get('zip').value;
    let infos: string = this.clientForm.get('info').value;

    let name = formName + " " + formSurname;
    let address =  formStreet + ' ' + formNr + (!formDoor || formDoor.length == 0 ? '' : '/' + formDoor) + ', ' +
      formZip + ' ' + formCity + ', ' + formCountry;

    return new Client(null, name, address, infos, email, phone, "");
  }

  private static fitsFilter(filter, client: Client): boolean {
    if (!filter) return true;

    let fits: boolean = true;
    fits = fits && (filter.name.length > 0 ? client.name.toLowerCase().includes(filter.name) : true);
    fits = fits && (filter.surname.length > 0 ? client.name.toLowerCase().includes(filter.surname) : true);
    fits = fits && (filter.phone.length > 0 ? client.phoneNumbers.toLowerCase().includes(filter.phone) : true);
    fits = fits && (filter.eMail.length > 0 ? client.emails.toLowerCase().includes(filter.eMail) : true);
    fits = fits && (filter.street.length > 0 ? client.address.toLowerCase().includes(filter.street) : true);
    fits = fits && (filter.country.length > 0 ? client.address.toLowerCase().includes(filter.country) : true);
    fits = fits && (filter.door.length > 0 ? client.address.toLowerCase().includes(filter.door) : true);
    fits = fits && (filter.nr.length > 0 ? client.address.toLowerCase().includes(filter.nr) : true);
    fits = fits && (filter.zip.length > 0 ? client.address.toLowerCase().includes(filter.zip) : true);
    fits = fits && (filter.city.length > 0 ? client.address.toLowerCase().includes(filter.city) : true);

    return fits;
  }

  clearClientForm() {
    this.clientForm.reset();
    this.touched = false;
    this.skipOnClientSearch = 0;
    this.oldFilter = null;
    this.selectedClient = null;
  }

  private generateFilter() {

    let searchName: string = this.clientForm.get('name').value;
    if (!searchName) searchName = "";
    searchName = searchName.toLowerCase();

    let searchSurname: string = this.clientForm.get('surname').value;
    if (!searchSurname) searchSurname = "";
    searchSurname = searchSurname.toLowerCase();

    let searchPhone: string = this.clientForm.get('phone').value;
    if (!searchPhone) searchPhone = "";
    searchPhone = searchPhone.toLowerCase();

    let searchEmail: string = this.clientForm.get('eMail').value;
    if (!searchEmail) searchEmail = "";
    searchEmail = searchEmail.toLowerCase();

    let searchStreet: string = this.clientForm.get('street').value;
    if (!searchStreet) searchStreet = "";
    searchStreet = searchStreet.toLowerCase();

    let searchCountry: string = this.clientForm.get('country').value;
    if (!searchCountry) searchCountry = "";
    searchCountry = searchCountry.toLowerCase();

    let searchNr: string = this.clientForm.get('nr').value;
    if (!searchNr) searchNr = "";
    searchNr = searchNr.toLowerCase();

    let searchDoor: string = this.clientForm.get('door').value;
    if (!searchDoor) searchDoor = "";
    searchDoor = searchDoor.toLowerCase();

    let searchCity: string = this.clientForm.get('city').value;
    if (!searchCity) searchCity = "";
    searchCity = searchCity.toLowerCase();

    let searchZip: string = this.clientForm.get('zip').value;
    if (!searchZip) searchZip = "";
    searchZip = searchZip.toLowerCase();

    return {name: searchName, surname: searchSurname, phone: searchPhone, eMail: searchEmail,
      street: searchStreet, country: searchCountry, nr: searchNr, door: searchDoor, city: searchCity, zip: searchZip};
  }

  wasTouched() {
    this.touched = true;
    this.selectedClient = null;
  }

  private fillClientIntoForm(client: Client) {
    let splitName = client.name.split(" ");
    let splitAddr = client.address.split(" ");

    let hasDoor = splitAddr[1].includes("/");

    let name = splitName[0];
    let surname = splitName[1];
    let phone = client.phoneNumbers;
    let eMail = client.emails;
    let street = splitAddr[0].split(",")[0];
    let country = splitAddr[splitAddr.length-1]
    let city = splitAddr[3].split(",")[0];
    let door = hasDoor ? splitAddr[1].split("/")[1].split(",")[0] : "";
    let nr = hasDoor ? splitAddr[1].split("/")[0] : splitAddr[1].split(",")[0];
    let zip = splitAddr[2];

    this.selectedClient = client;

    this.clientForm.controls['name'].setValue(name);
    this.clientForm.controls['surname'].setValue(surname);
    this.clientForm.controls['phone'].setValue(phone);
    this.clientForm.controls['eMail'].setValue(eMail);
    this.clientForm.controls['street'].setValue(street);
    this.clientForm.controls['country'].setValue(country);
    this.clientForm.controls['nr'].setValue(nr);
    this.clientForm.controls['door'].setValue(door);
    this.clientForm.controls['city'].setValue(city);
    this.clientForm.controls['zip'].setValue(zip);
  }

  findClient() {
    let filter = {};
    if (!this.touched && this.oldFilter)  filter = this.oldFilter;
    else filter = this.generateFilter();

    if (filter == this.oldFilter) {
      this.skipOnClientSearch ++;
    } else {
      this.oldFilter = filter;
      this.skipOnClientSearch = 0;
    }

    let filtered = this.clientList.filter(c => NewOrderComponent.fitsFilter(filter, c));
    if (filtered.length > 0) {
      this.fillClientIntoForm(filtered[this.skipOnClientSearch%filtered.length]);
      this.touched = false;
    }
  }
}
