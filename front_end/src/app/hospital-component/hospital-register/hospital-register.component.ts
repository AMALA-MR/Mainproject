import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-hospital-register',
  templateUrl: './hospital-register.component.html',
  styleUrls: ['./hospital-register.component.css']
})
export class HospitalRegisterComponent implements OnInit {
  name: String;
  city: String;
  district: String;
  state: String;
  password: String;
  pincode: String;
  submitted =false;
  hospitalForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private authService : AuthService,
    private router :Router
  ) { this.mainForm(); }

  ngOnInit(): void {
  }

  mainForm(){
    this.hospitalForm = this.fb.group({
      name: ['',[Validators.required]],
      city:['',[Validators.required]],
      district:['',[Validators.required]],
      state:['',[Validators.required]],
      pincode:['',[Validators.required]],
      type:['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }
  get myForm(){
    return this.hospitalForm.controls;
  }

  onSubmit(){
    this.submitted=true;
    if(!this.hospitalForm.valid){
      //console.log(this.hospitalForm.value)
      return false;
    }else{
        this.authService.registerHospital(JSON.stringify(this.hospitalForm.value)).subscribe(res=>{
          if(res.success){
            //console.log(res.msg);
            alert(res.msg)
             this.router.navigateByUrl('/home')
          }else{
            console.log(res.msg);
             this.router.navigateByUrl('/hospital_register')
          }
        },(error)=>{
          console.log(error)
      });
    }
  }
}
