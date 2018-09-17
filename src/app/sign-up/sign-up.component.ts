import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../auth.service';
import { AdminGuard } from "../guards/admin.guard";
import { AngularFireList } from 'angularfire2/database';
import { Member } from '../member';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
 sameEmailError:string;
 errorFlag:boolean=false;
 guardAdminValue:boolean;
 sameEmailErrorFlag:boolean=false;

  

 // sameNameError:string;
  constructor(private route: Router,private authservice:AuthService,private AG:AdminGuard) { }

  ngOnInit() {
    this.guardAdminValue = this.AG.guardAdminValue;
    console.log(this.guardAdminValue);
     }

//Data sending
  sendData(studentForm){
    this.authservice.validateSignUpMember(studentForm.value);
     this.sameEmailError=this.authservice.sameEmailError;
    this.errorFlag = this.authservice.errorFlag;
    //console.log(this.errorFlag);
    //console.log(this.sameEmailError);
   // this.route.navigate(['students']);
  }  
//navigation to login page 
  loginPageroute(){
    this.route.navigate(['login']);
  }
  checkMail(event){
    console.log(event.target.value);
    this.authservice.emailVerification(event.target.value);
    this.sameEmailError = this.authservice.sameEmailError;
    this.sameEmailErrorFlag = this.authservice.sameEmailErrorFlag;
  }
}
