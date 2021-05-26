import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-book-vaccination',
  templateUrl: './book-vaccination.component.html',
  styleUrls: ['./book-vaccination.component.css']
})
export class BookVaccinationComponent implements OnInit {
  bookForm: FormGroup;
  key:string;
  data:any=[];
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { this.mainForm(); }

  ngOnInit(): void {
    //this.key=value from text box
    
  }

  get myForm(){
    return this.bookForm.controls;
  }

  mainForm(){
    this.bookForm = this.formBuilder.group({
      district:['',[Validators.required]],
      state:['',[Validators.required]],
      pincode:['',[Validators.required]],

    })
  }


  searchbypincode(){
    
    this.authService.getBookSchedule(this.bookForm.value.pincode).subscribe(res=>{
      this.data=res
      console.log(res,"what data in it............")
     },(error)=>{
       console.log(error)
    });
    
  }

  searchbdistrict(){
    // console.log(this.bookForm.value.district,"valueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    this.authService.getBookSchedule(this.bookForm.value.district).subscribe(res=>{
      this.data=res
      console.log(res,"what data in it............")
     },(error)=>{
       console.log(error)
    });
  }

}
