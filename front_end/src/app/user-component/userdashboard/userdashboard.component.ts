import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  user: any = [];
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'))
  }

}
