import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from "@angular/router";
import * as moment from 'moment'
@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  user: any = [];
  btn: any =[];
  isDisabled = false;
  searchDate:string;
  birthyear:String;
  constructor(
    private authService: AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
    
    this.user = JSON.parse(localStorage.getItem('user'))
    this.authService.forbtndisabling(this.user.id).subscribe(res => {
      if(res.value=='booked'){
        this.isDisabled=true;
      }else if(res.value=='taken'){
        this.isDisabled=false;
      }
    }, (error) => {
      console.log(error)
    });
    
    this.authService.getbtnvalue(this.user.id).subscribe(res => {
      if(this.isDisabled==true){
        this.btn = "Booked"
      }else if(res.value==''){
        //this.btn =[{"status":"Schedule vaccine"}];
        this.btn = "Book first dose"
      }else if(res.value=='1'){
        this.btn ="Book second dose"
      }else if(res.value=='2'){
        this.btn = "Vaccination completed"
        this.isDisabled=true;
      }
      
    }, (error) => {
      console.log(error)
    });
    
  }
  
  onbooking(){
    if(window.confirm('Are you not vaccinated yet?')){
      this.router.navigateByUrl('/book/vaccination')
    }
    else{
      this.router.navigateByUrl('/userdashboard')
    }
  }

}
