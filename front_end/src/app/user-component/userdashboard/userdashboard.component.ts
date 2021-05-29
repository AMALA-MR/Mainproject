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
    this.authService.getbookdetails(this.user.id).subscribe(res => {
      if(res==''){
        this.btn =[{"status":"Schedule vaccine"}];
        //console.log(this.btn)
      }else{
        this.btn = res
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
