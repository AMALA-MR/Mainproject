import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

import { HelpfulLinksComponent } from './helpful-links/helpful-links.component';
import { FAQComponent } from './faq/faq.component';

import { CoronaService } from './shared/corona.service';
import { AuthService } from './Services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DistrictComponent } from './district/district.component';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './registration/user-register/user-register.component';
import { HospitalRegisterComponent } from './registration/hospital-register/hospital-register.component';
import { DoctorRegisterComponent } from './registration/doctor-register/doctor-register.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';


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
    DoctorRegisterComponent
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
    MatCardModule
  ],
  providers: [CoronaService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }