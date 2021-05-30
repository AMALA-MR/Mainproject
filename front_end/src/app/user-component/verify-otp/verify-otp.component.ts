import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {
  submitted =false;
  verifyForm: FormGroup;
  id:string;
  constructor(
    public fb: FormBuilder,
    private authService : AuthService,
    private router :Router,
    private route: ActivatedRoute
  ) { this.mainForm(); }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.id=params['id']
    })
  }

  mainForm(){
    this.verifyForm = this.fb.group({
      otp: ['',[Validators.required]]
    })
  }
  get myForm(){
    return this.verifyForm.controls;
  }
  onSubmit(){
    this.submitted=true;
    if(!this.verifyForm.valid){
      return false;
    }else{
      this.authService.verifyOtp(this.id,JSON.stringify(this.verifyForm.value)).subscribe(res=>{
        if(res.success){
          this.authService.storeUserToken(res.token, res.user);
          this.router.navigateByUrl('userdashboard')
        }else{
          console.log(res.msg);
        }

      })
    }
  }
}
