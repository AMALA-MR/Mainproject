import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-add-vaccine',
  templateUrl: './add-vaccine.component.html',
  styleUrls: ['./add-vaccine.component.css']
})
export class AddVaccineComponent implements OnInit {
  submitted = false;
  vaccineForm: FormGroup;
  data:any=[];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { this.mainForm(); }


  ngOnInit(): void {
    this.authService.getVaccine().subscribe(res=>{
      //console.log(res)
      this.data=res
     },(error)=>{
       console.log(error)
    });
  }

  mainForm() {
    this.vaccineForm = this.formBuilder.group({
      vaccine_name: ['', Validators.required]
    });
  }

  get myForm(){
    return this.vaccineForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.vaccineForm.valid) {
      return false;
    }else {
      this.authService.addVaccine(JSON.stringify(this.vaccineForm.value)).subscribe(res =>{
        if(res!=undefined){
          this.router.navigateByUrl('add/vaccine')
          this.vaccineForm.reset()
          this.ngOnInit();
        } else{
          //this.invalid=res.msg
          console.log(res.msg)
        }
      },(error)=> {
        console.log(error)
      });
    }
  }
}
