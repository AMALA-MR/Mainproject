import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  name: String;
  phone_no: String;
  adhar: String;
  password: String;
  gender: String;
  age: String;
  submitted =false;
  userForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private authService : AuthService,
    private router :Router
  ) { this.mainForm(); }

  ngOnInit(): void {

  }

  mainForm(){
    this.userForm = this.fb.group({
      name: ['',[Validators.required]],
      age:['',[Validators.required]],
      gender:['',[Validators.required]],
      adhar:['',[Validators.required]],
      phone_no:['',[Validators.required]],
      //password:['',[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
    })
  }
  get myForm(){
    return this.userForm.controls;
  }

  onSubmit(){
    this.submitted=true;
    if(!this.userForm.valid){
      return false;
    }else{
        this.authService.registerUser(JSON.stringify(this.userForm.value)).subscribe(res=>{
          if(res.success){
            this.authService.storeUserToken(res.token, res.user);
            console.log('User Successfully Registered');
            if(res.user.type=='user')
              this.router.navigateByUrl('/users/dashboard')
          }else{
            console.log('Somethings wrong');
            this.router.navigateByUrl('/register')
          }
        },(error)=>{
          console.log(error)
      });
    }
  }


}
