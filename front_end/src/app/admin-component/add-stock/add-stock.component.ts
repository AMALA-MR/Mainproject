import { Component, OnInit} from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../Services/auth.service';


@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit {
  submitted = false;
  stockForm: FormGroup;
  invalid: String;

  vcn:any=[];
  hsptl:any=[];
  data:any=[];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { this.mainForm(); }

  ngOnInit(): void {
    this.authService.gethospital().subscribe(res=>{
      this.hsptl=res
     },(error)=>{
       console.log(error)
    });
    this.authService.getVaccine().subscribe(res=>{
      //console.log(res)
      this.vcn=res
     },(error)=>{
       console.log(error)
    });
    this.authService.showStock().subscribe(res=>{
     // console.log(res)
      this.data=res
     },(error)=>{
       console.log(error)
    });
  }

  mainForm() {
    this.stockForm = this.formBuilder.group({
      vaccine: ['', Validators.required],
      hospital: ['', Validators.required],
      new_stock: ['', Validators.required]
    });
  }

  get myForm(){
    return this.stockForm.controls;
  }

  onUpdate(id){
    this.authService.addVaccineStock(JSON.stringify(this.stockForm.value)).subscribe(res =>{
      if(res!=undefined){
        this.router.navigateByUrl('stock')
        this.stockForm.reset()
        this.ngOnInit();
      } else{
        this.invalid=res.msg
        console.log(res.msg)
      }
    },(error)=> {
      console.log(error)
    });
  }


  onSubmit() {

    this.submitted = true;
    if (!this.stockForm.valid) {
      return false;
    }else {
      this.authService.addVaccineStock(JSON.stringify(this.stockForm.value)).subscribe(res =>{
        if(res!=undefined){
          this.router.navigateByUrl('stock')
          this.stockForm.reset()
          this.ngOnInit();
        } else{
          this.invalid=res.msg
          console.log(res.msg)
          //this.router.navigateByUrl('/login')
        }
      },(error)=> {
        console.log(error)
      });
    }
  }
}
