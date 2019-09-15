import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { LoginData } from './login-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http:HttpClient,private router : Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(
    fname:string, lname:string,
    email: string, password: string){
    const authData : AuthData = {
      fname: fname,
      lname: lname,
      email: email,
      password: password
    };
    this.http.post(BACKEND_URL + "/signup", authData)
    .subscribe(() =>{
      this.router.navigate["/auth/login"];
    }, _error =>{
      this.authStatusListener.next(false);
    });
  }

  login(email:string, password: string){
    const loginData: LoginData = { email: email, password: password };
    this.http.post
    <{token: string,expiresIn: number,userId: string}>
    (BACKEND_URL+ "/login",loginData)
    .subscribe(response =>{               //here post method of server returns a response & we are subscribing to that response by using .subscribe()
      const token = response.token;
      this.token = token;
      if(token){                          //here we are checking that is the token valid
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.userId = response.userId;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(token,expirationDate,this.userId);  //here we are passing token & expirationDuration to store in the localstorage of browser
      this.router.navigate(['/']);
      }
    }, _error =>{
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    /*here we are checking that is the expirationDate is in future
      and if expirationDate is less than 0 then expirationDate is
      expired therefore token is invalid and user authentication is failed and user need to login agin*/

    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;   //as expiresIn is greater than 0 so token is valid and we are setting timer for the token
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
    }
  }
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);

                          /*as user is logged out token is null and
                          user authentication is failed and we are
                          clearing timer and properties stored in localstorage*/
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() =>{
    this.logout();
    },duration * 1000);

  }

  saveAuthData(token:string, expriationDuration: Date,userId: string){
                                        /*here we are setting token & expiration property which is
                                         stored in localstorage of browser*/
    localStorage.setItem("token",token);
    localStorage.setItem("expiration",expriationDuration.toISOString());
    localStorage.setItem("userId",userId);
  }

  clearAuthData(){
                                        /*here we are clearing token & expiration property
                                         stored in localstorage of browser*/
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
                            /*here we are getting token & expirationDate from localstorage stored in browser*/
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if(!token ||  !expirationDate){
      return;
    }
    return{
     token: token,
     expirationDate: new Date(expirationDate),
     userId: userId
    }
  }
}
