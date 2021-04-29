import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { from } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../Services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  loginForm: FormGroup;
  invalid: String;
  
  constructor(
    private formBuilder: FormBuilder,
    private authServive: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit() {

    this.submitted == true;
    if (!this.loginForm.valid) {
      return false;
    }
    else if (this.loginForm.value.mail == 'admin@gmail.com') {
      console.log('admin loggined');
      this.authServive.authenticateUser(JSON.stringify(this.loginForm.value)).subscribe(res => {
        console.log(res);

        if (res.success) {
          console.log('loggedin');
          this.authServive.storeUserToken(res.token, res.user);
          this.ngZone.run(() => this.router.navigateByUrl('/home'))
        }
        else {
          this.invalid = 'Invalid username or password'
          this.router.navigateByUrl('/login')

        }
      }, (error) => {
        console.log(error)
      });
    }
  }
}
