import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { HelpfulLinksComponent } from './guest-component/helpful-links/helpful-links.component';
import { FAQComponent } from './guest-component/faq/faq.component';

import { CoronaService } from './shared/corona.service';
import { AuthService } from './Services/auth.service';
import { AuthGuard } from './services/auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './guest-component/home/home.component';
import { DistrictComponent } from './guest-component/district/district.component';
import { LoginComponent } from './guest-component/login/login.component';
import { UserRegisterComponent } from './user-component/user-register/user-register.component';
import { HospitalRegisterComponent } from './hospital-component/hospital-register/hospital-register.component';
import { DoctorRegisterComponent } from './doctor-component/doctor-register/doctor-register.component';
import { NavBarComponent } from './guest-component/nav-bar/nav-bar.component';
import { UserdashboardComponent } from './user-component/userdashboard/userdashboard.component';
import { DoctordashboardComponent } from './doctor-component/doctordashboard/doctordashboard.component';
import { HospitaldashboardComponent } from './hospital-component/hospitaldashboard/hospitaldashboard.component';
import { AdmindashboardComponent } from './admin-component/admindashboard/admindashboard.component';
import { UnavbarComponent } from './user-component/unavbar/unavbar.component';
import { AnavbarComponent } from './admin-component/anavbar/anavbar.component';
import { HnavbarComponent } from './hospital-component/hnavbar/hnavbar.component';
import { DnavbarComponent } from './doctor-component/dnavbar/dnavbar.component';
import { AddStockComponent } from './admin-component/add-stock/add-stock.component';
import { AddVaccineComponent } from './admin-component/add-vaccine/add-vaccine.component';
import { ViewRequestComponent } from './admin-component/view-request/view-request.component';
import { ScheduleVaccinationComponent } from './hospital-component/schedule-vaccination/schedule-vaccination.component';
import { ViewrequestComponent } from './hospital-component/viewrequest/viewrequest.component';
import { BookVaccinationComponent } from './user-component/book-vaccination/book-vaccination.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DistrictComponent,
    HelpfulLinksComponent,
    FAQComponent,
    NavBarComponent,
    LoginComponent,
    UserRegisterComponent,
    HospitalRegisterComponent,
    DoctorRegisterComponent,
    UserdashboardComponent,
    DoctordashboardComponent,
    HospitaldashboardComponent,
    AdmindashboardComponent,
    UnavbarComponent,
    AnavbarComponent,
    HnavbarComponent,
    DnavbarComponent,
    AddStockComponent,
    AddVaccineComponent,
    ViewRequestComponent,
    ScheduleVaccinationComponent,
    ViewrequestComponent,
    BookVaccinationComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    Ng2SearchPipeModule
  ],
  providers: [CoronaService,AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }