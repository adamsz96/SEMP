import {Injectable} from '@angular/core';
import {AuthRequest} from '../dtos/auth-request';
import {interval, Observable} from 'rxjs';
import {AuthResponse} from '../dtos/auth-response';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import {Globals} from '../global/globals';
import {Employee} from "../dtos/employee";
import {EmployeeService} from "./employee.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authenticationScheduler: Observable<any> = interval(1000);
  private authenticationBaseUri: string = this.globals.backendUri + '/authentication';

  constructor(private http: HttpClient, private globals: Globals,private employeeService:EmployeeService) {
    this.scheduleReAuthentication();
  }

  /**
   * Login in a User. If the User is valid a JWT is stored in localstorage otherwise 401.
   * @param authRequest
   */
   loginUser(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authenticationBaseUri, authRequest)
      .pipe(
        tap((authResponse: AuthResponse) => this.setToken(authResponse))
      );
  }

  /**
   * removes JWT from localstorage
   */
  logoutUser() {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Writes tokens into localstorage
   * @param authResponse
   */
  setToken(authResponse: AuthResponse){
    console.log('saving current token and refresh token');

    localStorage.setItem('currentToken', authResponse.currentToken);
    localStorage.setItem('refreshToken', authResponse.futureToken);
  }

  /**
   * returns CurrentToken from localstorage
   */
  getCurrentToken() {
    return localStorage.getItem('currentToken');
  }

  /**
   * returns FutureToken from localstorage
   */
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Check if a valid JWT token is saved in localstorage
   */
  isLoggedIn() {
    return !!this.getCurrentToken() && (this.getTokenExpirationDate(this.getCurrentToken()).valueOf() > new Date().valueOf());
  }

  /**
   * Returns the usersaved in CurrentToken
   */
  getUserRole() {
    if (this.getCurrentToken() != null) {
      const decoded: any = jwt_decode(this.getCurrentToken());
      const authInfo = decoded.aut;
      if (authInfo.includes('ADMIN')) {
        return 'ADMIN';
      } else if (authInfo.includes('MANAGER')) {
        return 'MANAGER';
      } else if(authInfo.includes('EMPLOYEE')) {
        return 'EMPLOYEE';
      }
    }
    return 'UNDEFINED';
  }
  async getCurrentUser():Promise<Employee>{
     return this.employeeService.getEmployeeByUsername( this.getUsername(this.getCurrentToken())).toPromise();
    }
  getUser() {
    if (this.getCurrentToken() != null) {
      const decoded: any = jwt_decode(this.getCurrentToken());
      const authInfo = decoded.aut;
      if (authInfo.includes('ADMIN')) {
        return 'ADMIN';
      } else if (authInfo.includes('MANAGER')) {
        return 'MANAGER';
      } else if(authInfo.includes('EMPLOYEE')) {
        return 'EMPLOYEE';
      }
    }
    return 'UNDEFINED';
  }

  /**
   * JWT token expires after 10 minutes, therefore a new token will requested 1 minute before the expiration
   */
  private scheduleReAuthentication() {
    this.authenticationScheduler.subscribe(() => {
      if (this.isLoggedIn()) {
        const timeLeft = this.getTokenExpirationDate(this.getCurrentToken()).valueOf() - new Date().valueOf();
        if ((timeLeft / 1000) < 60) {
          this.reAuthenticate(this.getRefreshToken()).subscribe(
            () => {
              console.log('Re-authenticated successfully');
            },
            error => {
              console.log('Could not re-authenticate ' + error);
            });
        }
      }
    });
  }

  /**
   * Use futureToken as new token and request a new futureToken
   */
  private reAuthenticate(token:String): Observable<AuthResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };

    return this.http.get<AuthResponse>(this.authenticationBaseUri, httpOptions)
      .pipe(
        tap((authResponse: AuthResponse) => this.setToken(authResponse))
      );
  }

  /**
   *
   * returns expirationDate of token
   * @param token
   */
  private getTokenExpirationDate(token: string): Date {

    const decoded: any = jwt_decode(token);
    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
  private getUsername(token:string){
    const decoded: any=jwt_decode(token);
    return decoded.pri;
  }


}
