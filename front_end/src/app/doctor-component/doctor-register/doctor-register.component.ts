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
  list:any=[];

  submitted =false;
  userForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { this.mainForm(); }

  ngOnInit(): void {
     this.authService.gethospital().subscribe(res=>{
       this.list=res
      },(error)=>{
        console.log(error)
     });
  }
  mainForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      adhar_no: ['', [Validators.required]],
      phone_no: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
      password:['',[Validators.required]],
      specialization:['',[Validators.required]]
      // password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
    })
  }
  get myForm() {
    return this.userForm.controls;
  }

  onSubmit(){
    this.submitted=true;
    if(!this.userForm.valid){
      return false;
    }else{
      const value= this.userForm.value
      const values={
        name:value.name,
        age:value.age,
        gender:value.gender,
        adhar_no:value.adhar_no,
        phone_no:value.phone_no,
        hospital:value.hospital,
        password:value.password,
        login_type:'doctor',
        specialization:value.specialization
      } 
      console.log(values)
        this.authService.registerDoctor(JSON.stringify(values)).subscribe(res=>{
         if(res.success){
            console.log(res.msg);
              this.router.navigateByUrl('/home')
          }
        },(error)=>{
          console.log(error)
      });
    }
  }

}
