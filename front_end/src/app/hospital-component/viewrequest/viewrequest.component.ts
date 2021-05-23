import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../Services/auth.service';
@Component({
  selector: 'app-viewrequest',
  templateUrl: './viewrequest.component.html',
  styleUrls: ['./viewrequest.component.css']
})
export class ViewrequestComponent implements OnInit {
  doctors:any=[];
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,) { }

  ngOnInit(): void {
    const doctor= JSON.parse(localStorage.getItem('user'))

    this.authService.getdoctorsrequest(doctor.id).subscribe(res=>{
      this.doctors=res
      console.log(res,"valueeeeeeeeees")
     },(error)=>{
       console.log(error)
    });
  }

}
