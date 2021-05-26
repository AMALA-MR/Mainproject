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
  searchDate:string;
  birthyear:String;
  constructor(
    private authService: AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('user'))
  }
  onbooking(){
    this.router.navigateByUrl('/book/vaccination')
  }

}
