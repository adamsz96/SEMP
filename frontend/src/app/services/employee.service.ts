import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Globals} from "../global/globals";
import {Observable} from "rxjs";
import {Employee} from "../dtos/employee";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeeBaseUri: string = this.globals.backendUri + '/employees';


  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * Loads all Employees from the backend
   */
  getEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(this.employeeBaseUri);
  }
  //.pipe(catchError(this.handleError<Employee[]>('getEmployees', [])))

  /**
   * Loads specific Employee from the backend
   * @param id of Employee to load
   */
  getEmployeeById(id: number): Observable<Employee> {
    console.log('Load employee with id: ' + id);
    return this.httpClient.get<Employee>(this.employeeBaseUri + '/' + id);
  }

  /**
   * Persists employee to the backend
   * @param employee to persist
   */
  createEmployee(employee: Employee): Observable<Employee> {
    console.log('Create employee with name ' + Employee.name);
    return this.httpClient.post<Employee>(this.employeeBaseUri, Employee);
  }

  updateEmployee(employee: Employee): Observable<Employee>{
    return this.httpClient.put<Employee>(this.employeeBaseUri, employee).pipe(
      tap(_ => console.log('updated employee id=?{employee.id}'))
    );
  }

  addEmployee(employee: Employee): Observable<Employee>{
    return this.httpClient.post<Employee>(this.employeeBaseUri, employee);
  }
  getEmployeeByUsername(username:String):Observable<Employee>{
    console.log("get employee for username: "+username);
    return this.httpClient.get<Employee>(this.employeeBaseUri+"/currentUser/"+username)
  }
}
