import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpfulLinksComponent } from './guest-component/helpful-links/helpful-links.component';
import { FAQComponent } from './guest-component/faq/faq.component';
import { HomeComponent } from './guest-component/home/home.component';
import { LoginComponent } from './guest-component/login/login.component';
import { UserRegisterComponent } from './user-component/user-register/user-register.component';
import { HospitalRegisterComponent } from './hospital-component/hospital-register/hospital-register.component';
import { DoctorRegisterComponent } from './doctor-component/doctor-register/doctor-register.component';
import {UserdashboardComponent} from './user-component/userdashboard/userdashboard.component';
import {DoctordashboardComponent} from './doctor-component/doctordashboard/doctordashboard.component' ;
import {HospitaldashboardComponent} from './hospital-component/hospitaldashboard/hospitaldashboard.component';
import {AdmindashboardComponent} from './admin-component/admindashboard/admindashboard.component';


import { from } from 'rxjs';


const routes: Routes = [
  
  { path: '', component: HomeComponent },
  { path: 'home',component:HomeComponent},
  { path: 'helpful', component: HelpfulLinksComponent },
  { path: 'faq', component: FAQComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user_register', component: UserRegisterComponent },
  { path: 'hospital_register', component: HospitalRegisterComponent },
  { path: 'doctor_register', component: DoctorRegisterComponent },
  { path: 'userdashboard', component: UserdashboardComponent },
  { path: 'doctordashboard', component: DoctordashboardComponent },
  { path: 'hospitaldashboard', component: HospitaldashboardComponent },
  { path: 'admindashboard', component:  AdmindashboardComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
