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
  adhar_no: String;
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
      adhar_no:['',[Validators.required]],
      phone_no:['',[Validators.required]],
      password:['',[Validators.required]]
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
        //console.log(this.userForm.value)
        const value= this.userForm.value
        const values={
          name:value.name,
          age:value.age,
          gender:value.gender,
          adhar_no:value.adhar_no,
          phone_no:value.phone_no,
          password:value.password,
          login_type:'user'
        } 
        console.log(JSON.stringify(values))
        this.authService.registerUser(JSON.stringify(values)).subscribe(res=>{
          if(res.success){
            //this.authService.storeUserToken(res.token, res.user);
            console.log(res);
            const r_id=res.request_id
            this.router.navigateByUrl(`verify_otp/${r_id}`)
          }else{
            console.log(res.msg);
            // this.router.navigateByUrl('/register')
          }
        },(error)=>{
          console.log(error)
      });
    }
  }


}
