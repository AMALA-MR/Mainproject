import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { validateBasis } from '@angular/flex-layout';

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.css']
})
export class DoctorRegisterComponent implements OnInit {
  name: String;
  phone_no: String;
  adhar_no: String;
  password: String;
  gender: String;
  age: String;
  hospital:String;
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
      adhar_no:['',[Validators.required]],
      phone_no:['',[Validators.required]],
      hospital:['',[Validators.required]],
      password:['',[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
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
            console.log('doctor Successfully Registered');
            if(res.user.type=='doctor')
            this.router.navigateByUrl('/')
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
