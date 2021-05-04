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

  // user or doctor registraction
  registerUser(user): Observable<any> {
    let url = `${this.userUri}/register`
    return this.http.post(url, user, { headers: this.headers }).pipe(catchError(this.errorMgmt))
  }

  // user or doctor registraction
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
