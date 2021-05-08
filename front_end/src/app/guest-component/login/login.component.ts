import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../Services/auth.service';

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
    }else if(this.loginForm.value.username=='admin'){
      this.authService.authenticateAdmin(JSON.stringify(this.loginForm.value)).subscribe(res=>{
        if(res.success){
          console.log('admin logined')
          this.authService.storeUserToken(res.token, res.admin);
          this.router.navigateByUrl('/admindashboard')
        }else{
          this.invalid='Invalid username or password'
          this.router.navigateByUrl('/login')
        }
      })
    }else {
      this.authService.authenticateUser(JSON.stringify(this.loginForm.value)).subscribe(res =>{
        //console.log(res.user)
        if(res.success){
          console.log('logined')
          this.authService.storeUserToken(res.token, res.user);

          if(res.user.login_type=='user')
          this.router.navigateByUrl('/userdashboard')

          if(res.user.login_type=='doctor')
          this.router.navigateByUrl('/doctordashboard')

          if(res.user.login_type=='hospital')
          this.router.navigateByUrl('/hospitaldashboard')
        } else{
          this.invalid=res.msg
          console.log(res.msg)
          this.router.navigateByUrl('/login')
        }
      },(error)=> {
        console.log(error)
      });
    }
  }
}
