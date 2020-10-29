import {Component, OnInit} from '@angular/core';
import {Employee} from "../../dtos/employee";
import {EmployeeService} from "../../services/employee.service";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})

export class EmployeeComponent implements OnInit {
  private searchWord: string;
  private filteredEmployeeList: Employee[];
  private employeeList: Employee[];
  private newEmployee: Employee;
  private selectedEmployee: Employee;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      (employees) => {
        this.employeeList = employees;
        this.filteredEmployeeList = employees;
      },
    () => {}
    )}

  clear(){
    this.searchWord = '';
    this.filteredEmployeeList = this.employeeList;
  }

  filter() {
    console.log('filter');
    let searchWord = this.searchWord.trim().toLowerCase();

    this.filteredEmployeeList = this.employeeList.filter((employee) => {

      if ((employee.id + '').toLowerCase().includes(searchWord) || (employee.name + '').toLowerCase().includes(searchWord) || (employee.staffNumber + '').toLowerCase().includes(searchWord) || (employee.salaryPerHour + '').toLowerCase().includes(searchWord)){
        return true;
      } else {
        return false;
      }
    });
  }

  onSelect(employee: Employee): void {
    this.selectedEmployee = employee;
    this.newEmployee = employee;
  }

  styleUrls: ['./employee.component.css']
}

