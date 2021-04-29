import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { map, catchError, retry } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  constructor( private http : HttpClient) { }


  baseUri:string = 'http://localhost:3000/users/authenticate';

  headers = new HttpHeaders().set('', 'json/application');

  authenticateUser(authCredentials): Observable<any> {
    let url= `${this.baseUri}/authenticate`
    return this.http.post(url, authCredentials, { headers: this.headers}).pipe(catchError(this.errorMgmt))
    
  }   

  storeUserToken(token, user){
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.authToken = token
    this.user = user
    
  }
  

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
