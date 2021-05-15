import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.css']
})
export class ViewRequestComponent implements OnInit {
  hospital:any=[];
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.gethospitalrequest().subscribe(res=>{
      this.hospital=res
      console.log(res)
     },(error)=>{
       console.log(error)
    });


  }
  onApprove(id){
    const data={
      confirm:'1'
    }
    if(window.confirm('Are you sure to approve?')){
      this.authService.approvehospital(id,JSON.stringify(data)).subscribe(res=>{
        console.log(res)
        this.ngOnInit()
      },(error)=>{
        console.log(error)
      })
    }
  }
  
  onReject(id){
    const data={
      confirm:'-1'
    }
    if(window.confirm('Are you sure to reject?')){
      this.authService.approvehospital(id,JSON.stringify(data)).subscribe(res=>{
        console.log('Rejected')
        this.ngOnInit()
      },(error)=>{
        console.log(error)
      })
    }
  }

}
