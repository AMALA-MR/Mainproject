import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { map, catchError, retry } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  helper = new JwtHelperService();
  list: any;

  userUri: string = 'http://localhost:3000/users';
  doctorUri: string = 'http://localhost:3000/doctor';
  hospitalUri = 'http://localhost:3000/hospital';
  adminUri = 'http://localhost:3000/admin';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // user registraction
  registerUser(user): Observable<any> {
    let url = `${this.userUri}/register`
    return this.http.post(url, user, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }
  // verify user phone no
  verifyOtp(id,otps): Observable<any> {
    let url = `${this.userUri}/verify/${id}`
    return this.http.post(url, otps, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  // doctor registraction
  registerDoctor(doctor): Observable<any> {
    let url = `${this.doctorUri}/register`
    return this.http.post(url, doctor, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }
  // hospital registraction
  registerHospital(hospital): Observable<any> {
    let url = `${this.hospitalUri}/register`
    return this.http.post(url, hospital, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  //user login
  authenticateUser(user): Observable<any> {
    let url = `${this.userUri}/authenticate`
    return this.http.post(url, user, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  //admin login
  authenticateAdmin(admin): Observable<any> {
    let url = `${this.adminUri}/authenticate`
    return this.http.post(url, admin, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  //get registered hospital
  gethospital(): Observable<any> {
    let url = `${this.hospitalUri}/list`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }
  // approve hospital
  approvehospital(id, confirm): Observable<any> {
    let url = `${this.adminUri}/approve/${id}`
    return this.http.put(url, confirm, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

//approve doctor
approvedoctor(id, confirm): Observable<any> {
  let url = `${this.hospitalUri}/approve/${id}`
  return this.http.put(url, confirm, { headers: this.headers }).pipe(catchError(this.errorMgmt))
}
  //get requested doctors list
  getdoctorsrequest(id): Observable<any> {
    let url = `${this.hospitalUri}/approve/${id}`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }
  // get requested hospital list
  gethospitalrequest(): Observable<any> {
    let url = `${this.adminUri}/approve`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  //get vaccine names
  getVaccine(): Observable<any> {
    let url = `${this.userUri}/vaccine/list`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  //get stock for a particular hospital
  getStockVaccine(hid): Observable<any> {
    let url = `${this.hospitalUri}/vaccine/list/${hid}`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  // get schedules in a particular hospital
  getSchedule(hid): Observable<any> {
    let url = `${this.hospitalUri}/view/schedule/${hid}`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  // get schedules in a particular hospital
  getBookSchedule(key): Observable<any> {
    let url = `${this.userUri}/view/schedule/${key}`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  //add vaccine details
  addVaccine(vaccine): Observable<any> {
    let url = `${this.adminUri}/add/vaccine`
    return this.http.post(url, vaccine, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }
  // add vaccine stock 
  addVaccineStock(stock): Observable<any> {
    let url = `${this.adminUri}/add/vaccine/hospital`
    return this.http.post(url, stock, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  // add new vaccine slot booking  
  addVaccineBooking(data): Observable<any> {
    let url = `${this.userUri}/bookings`
    return this.http.post(url, data, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }
  // get main stock details to admin
  showStock(): Observable<any> {
    let url = `${this.adminUri}/get/vaccine/stock`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

   // get booking info from booking table
   getbookdetails(id): Observable<any> {
    let url = `${this.userUri}/book/list/${id}`
    return this.http.get(url, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  //Schedule Vaccination slots by Hospital
  scheduleSlot(schedule): Observable<any> {
    let url = `${this.hospitalUri}/add/schedule`
    return this.http.post(url, schedule, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }
  //Set token
  storeUserToken(token, user) {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.authToken = token
    this.user = user
  }

  // check login or not
  loggedIn() {
    let isToken = localStorage.getItem('access_token');
    return this.helper.isTokenExpired(isToken);
  }

  //logout
  logout() {
    this.authToken = null;
    localStorage.clear();
  }

  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
