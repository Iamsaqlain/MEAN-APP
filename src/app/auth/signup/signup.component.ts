import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub : Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit() {
   this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
     _authStatus =>{
       this.isLoading = false;
     }
   );
  }

  onSignUpForm(form:NgForm){
    if(form.invalid){
      return;
    }
    else{
      this.isLoading = true;
      this.authService.createUser(
        form.value.fname,
        form.value.lname,
        form.value.email,
        form.value.password
        );
    }
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
