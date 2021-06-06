import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpfulLinksComponent } from './guest-component/helpful-links/helpful-links.component';
import { FAQComponent } from './guest-component/faq/faq.component';
import { HomeComponent } from './guest-component/home/home.component';
import { DistrictComponent } from './guest-component/district/district.component';
import { LoginComponent } from './guest-component/login/login.component';
import { UserRegisterComponent } from './user-component/user-register/user-register.component';
import { HospitalRegisterComponent } from './hospital-component/hospital-register/hospital-register.component';
import { DoctorRegisterComponent } from './doctor-component/doctor-register/doctor-register.component';
import {UserdashboardComponent} from './user-component/userdashboard/userdashboard.component';
import {DoctordashboardComponent} from './doctor-component/doctordashboard/doctordashboard.component' ;
import {HospitaldashboardComponent} from './hospital-component/hospitaldashboard/hospitaldashboard.component';
import {AdmindashboardComponent} from './admin-component/admindashboard/admindashboard.component';
import { AddStockComponent } from './admin-component/add-stock/add-stock.component';
import { AddVaccineComponent } from './admin-component/add-vaccine/add-vaccine.component';
import { ViewRequestComponent } from './admin-component/view-request/view-request.component';
import { ScheduleVaccinationComponent } from './hospital-component/schedule-vaccination/schedule-vaccination.component';
import { ViewrequestComponent } from './hospital-component/viewrequest/viewrequest.component';
import { BookVaccinationComponent } from './user-component/book-vaccination/book-vaccination.component';
import { VerifyOtpComponent } from './user-component/verify-otp/verify-otp.component';
import { VaccinationComponent } from './hospital-component/vaccination/vaccination.component';

import { from } from 'rxjs';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  
  { path: '', component: HomeComponent },
  { path: 'home',component:HomeComponent},
  { path: 'helpful', component: HelpfulLinksComponent },
  { path: 'faq', component: FAQComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user_register', component: UserRegisterComponent },
  { path: 'hospital_register', component: HospitalRegisterComponent },
  { path: 'doctor_register', component: DoctorRegisterComponent },
  { path: 'userdashboard', component: UserdashboardComponent,canActivate:[AuthGuard] },
  { path: 'doctordashboard', component: DoctordashboardComponent,canActivate:[AuthGuard] },
  { path: 'hospitaldashboard', component: HospitaldashboardComponent,canActivate:[AuthGuard] },
  { path: 'admindashboard', component:  AdmindashboardComponent,canActivate:[AuthGuard]},
  { path: 'stock', component:  AddStockComponent,canActivate:[AuthGuard]},
  { path: 'add/vaccine', component: AddVaccineComponent,canActivate:[AuthGuard]},
  { path: 'view/requests', component: ViewRequestComponent,canActivate:[AuthGuard]},
  { path: 'schedule/vaccination', component: ScheduleVaccinationComponent,canActivate:[AuthGuard]},
  { path: 'doctor/requests', component: ViewrequestComponent,canActivate:[AuthGuard]},
  { path: 'book/vaccination', component: BookVaccinationComponent,canActivate:[AuthGuard]},
  { path: 'vaccination', component: VaccinationComponent,canActivate:[AuthGuard]},
  { path: 'verify_otp/:id', component: VerifyOtpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
