import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
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
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) { this.mainForm(); }

  ngOnInit(): void {
    
  }
  mainForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get myForm(){
    return this.loginForm.controls;
  }


  onSubmit() {

    this.submitted == true;
    if (!this.loginForm.valid) {
      return false;
    }else {
      console.log(JSON.stringify(this.loginForm.value))
      this.authService.authenticateUser(JSON.stringify(this.loginForm.value)).subscribe(res =>{
        console.log(res)
        //console.log(res.user)
        if(res.success){
          console.log('logined')
          this.authService.storeUserToken(res.token, res.user);
          this.ngZone.run(() =>this.router.navigateByUrl('/login'))
        } else{
          //this.flashMessages.show('Invalid username or password',{ cssClass:'alert-danger', timeout: '3000'});
          this.invalid='Invalid username or password'
          this.router.navigateByUrl('/login')
        }
      },(error)=> {
        console.log(error)
      });
    }
  }
}
