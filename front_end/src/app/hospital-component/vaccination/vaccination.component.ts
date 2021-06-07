import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-vaccination',
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccinationComponent implements OnInit {
  searchAadhar: string;
  data:any=[];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const hospital= JSON.parse(localStorage.getItem('user'))

    this.authService.getBooking(hospital.id).subscribe(res=>{
      this.data=res
      console.log(res)
     },(error)=>{
       console.log(error)
    });
  }
  
  onConfirm(id){
    if(window.confirm('Are you sure to confirm?')){
      this.authService.confirmVaccination(id).subscribe(res=>{
        this.data=res
        console.log(res)
      },(error)=>{
        console.log(error)
      }); 
    }
  }
}
