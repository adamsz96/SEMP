import {Component, Input, OnInit} from '@angular/core';
import {Employee} from "../../../dtos/employee";
import {EmployeeService} from "../../../services/employee.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Globals} from "../../../global/globals";
import {Skill} from "../../../dtos/skill";
import {SkillService} from "../../../services/skill.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  @Input()
  public editEmployee: Employee;

  public isNew: boolean;
  public editMode: boolean;
  public allSkills: Skill[];

  constructor(private employeeService: EmployeeService,
              private skillService: SkillService,
              private route: ActivatedRoute,
              public globals: Globals,
              private router: Router,
              private toastr: ToastrService) {}

  ngOnInit() {
    this.getEmployee();
    this.getSkills();
  }

  getEmployee() {
    this.isNew = +this.route.toString().indexOf("new") != -1;
    if (this.isNew) {
      this.editEmployee = new Employee(undefined, "", "", 0, false, false, null, [], "");
      this.editMode = true;
    } else {
      this.editMode = false;
      const id = +this.route.snapshot.paramMap.get('id');
      this.employeeService.getEmployeeById(id).subscribe(employee => {
        this.editEmployee = employee;
      });
    }
  }

  private validateEmployee(): boolean {
    if (this.editEmployee.name == undefined || this.editEmployee.name.length == 0) {
      this.toastr.error("Name has to be set");
      return false;
    }
    if (this.editEmployee.salaryPerHour == undefined || this.editEmployee.salaryPerHour < 0) {
      this.toastr.error("Salary has to be greater or equal than 0");
      return false;
    }
    if (this.editEmployee.staffNumber == undefined || this.editEmployee.staffNumber.length == 0) {
      this.toastr.error("Staff number has to be set");
      return false;
    }
    return true;
  }

  saveEmployee(): void{
    console.log("start saveEmployee");
    if (this.validateEmployee()) {
      if (this.isNew) {
        this.addEmployee();
      } else {
        this.updateEmployee();
      }
    }
  }

  updateEmployee(): void{
    this.employeeService.updateEmployee(this.editEmployee).subscribe(x => {
      this.router.navigateByUrl("/employee");
    },
    error => {
      console.log("Error. Could not add employee, because: " + error.error.message);
      this.toastr.error("Error. Could not add employee, because: " + error.error.message);
    });
  }

  addEmployee(): void{
    this.employeeService.addEmployee(this.editEmployee).subscribe(_ => {
      //console.log("added employee");
      this.router.navigate(["/employee"])
    },
    error => {
      console.log("Error. Could not add employee, because: " + error.error.message);
      this.toastr.error("Error. Could not add employee, because: " + error.error.message);
    });
    //this.location.go("/employee")
  }

  getSkills(): void {
    this.skillService.getSkills()
      .subscribe(skills => this.allSkills = skills);
  }

}
