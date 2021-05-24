import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../Services/auth.service';
import * as moment from 'moment'

@Component({
  selector: 'app-schedule-vaccination',
  templateUrl: './schedule-vaccination.component.html',
  styleUrls: ['./schedule-vaccination.component.css']
})
export class ScheduleVaccinationComponent implements OnInit {
  submitted = false;
  scheduleForm: FormGroup;
  searchDate:string;
  
  vcn:any=[];
  data:any=[];

  //hospital_id: String
  invalid: String;
  max: String;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { this.mainForm();  }

  ngOnInit(): void {
    this.searchDate = moment().format('yyyy-MM-DD')
    this.invalid="";
    this.max="";
    const hospital= JSON.parse(localStorage.getItem('user'))

    this.authService.getStockVaccine(hospital.id).subscribe(res=>{
      this.vcn=res
      console.log(res)
     },(error)=>{
       console.log(error)
    });

    this.authService.getSchedule(hospital.id).subscribe(res=>{
      this.data=res
      console.log(res)
     },(error)=>{
       console.log(error)
    });

  }
  mainForm() {
    this.scheduleForm = this.formBuilder.group({
      vaccine: ['', Validators.required],
      date: ['', Validators.required],
      slot: ['', Validators.required],
      allocated_amount:['', Validators.required]
    });
    //this.searchForm = this.formBuilder.group({
    //  searchdate:['', Validators.required]
    //})
  }

  get myForm(){
    return this.scheduleForm.controls;
  }

  //selectDate(){
   // console.log(this.searchForm.value)

  //}
  onSubmit(){
    this.submitted = true;
    const val= this.scheduleForm.value
    const hospital= JSON.parse(localStorage.getItem('user'))
    const values={
      vaccine:val.vaccine,
      hospital:hospital.id,
      date:val.date,
      slot:val.slot,
      allocated_amount:val.allocated_amount,
    }
    if (!this.scheduleForm.valid) {
      return false;
    }else if(parseInt(val.allocated_amount) > 20){
      this.max="20"
      return false
    }else {
      this.authService.scheduleSlot(JSON.stringify(values)).subscribe(res =>{
        if(!res.success){
          this.invalid=res.msg
        }else{
          //this.router.navigateByUrl('schedule/vaccination')
          this.scheduleForm.reset()
          this.submitted = false;
          this.ngOnInit();
        }
      },(error)=> {
        console.log(error)
      });
    }

  }
}
