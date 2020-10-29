import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {AuthRequest} from '../../dtos/auth-request';
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  usernameLabelDown: boolean = true;
  passwordLabelDown: boolean = true;
  submitted: boolean = false;
  error: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {

  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Form validation will start after the method is called, additionally an AuthRequest will be sent
   */
  loginUser() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const authRequest: AuthRequest = new AuthRequest(this.loginForm.controls.username.value, this.loginForm.controls.password.value);

      this.authenticationService.loginUser(authRequest).subscribe(

        () => {
              this.router.navigate(['/dashboard']);
          },
            (error) => {
              this.error = true; this.errorMessage = error.error.message;
              this.toastr.error(this.errorMessage);
            }
      );
    } else {
      console.log('Invalid input');
    }
  }

  toggleLabel(){
    if(document.getElementById('username') as HTMLInputElement === document.activeElement || (document.getElementById('username') as HTMLInputElement).value !== "" ){
      this.usernameLabelDown = false;
    } else {
      this.usernameLabelDown = true;
    }
    if(document.getElementById('password') as HTMLInputElement === document.activeElement || (document.getElementById('password') as HTMLInputElement).value !== "" ){
      this.passwordLabelDown = false;
    } else {
      this.passwordLabelDown = true;
    }
  }
}
