import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Member } from "./member";
import { Http, Headers, Response, RequestOptions  } from '@angular/http';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';
import {Md5} from 'ts-md5/dist/md5';
import { NavigationEnd } from '@angular/router';


import { Observable } from "rxjs";
import { getLocaleDateFormat } from '@angular/common';
import { variable } from '@angular/compiler/src/output/output_ast'
import { LeaveApp } from './leave-application';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  baseURL= "https://egovernance-81e95.firebaseio.com/Members/";

  list:any[];
  applicationList:AngularFireList<any>;
  memberList: AngularFireList<any>;
  members:any[];
  activeStudentKey:string;
  activeAdminKey:string;
  activeAdminName;
  counsellor:any[]
  //studentData:any[];
  public matchedStudentData:any[];
  counsellorList:AngularFireList<any>;
  //md5 = new Md5();
  constructor(private route:ActivatedRoute,private spinner : NgxSpinnerService ,private db:AngularFireDatabase,private router:Router ,public afs: AngularFirestore,private http:Http,private toastr:ToastrService ) {
    this.memberList=db.list('/Members');
    db.list('/Members').valueChanges().subscribe(members =>{  
     this.members=members;
  //   console.log(this.members);
  });
  this.applicationList = db.list('/leave-application');
  }

   submitApplication(data : LeaveApp , id:string , status:string ,url:string,name:string,email:string,uniqueId:string,date:Date){
     this.spinner.show();
      this.applicationList.push({
        id: id,
        name: name,
        email: email,
        subject:data.title,
        content:data.content,
        status:status,
        Url: url,
        uniqueId:uniqueId,
        date:date
      }).then(()=>{ 
        this.toastr.success("","Application Submitted Successfully")
        this.spinner.hide();
      },
       );
   }

/****************** All student-data component logic is here **************************************************/    


          /*********************Getting Student data for associated counsellor *******************/


          getStudentData(){
            this.spinner.show();
            this.matchedStudentData = [];
            for(let i=0;i<this.members.length;i++){
              if(this.members[i].counsellor == this.activeAdminName ){
                  //alert("matched");
                  this.matchedStudentData.push(this.members[i])
                  //this.spinner.hide();    
            }
          }
          this.spinner.hide();
        }  

          /*********************Getting Student data for associated counsellor ends *******************/
/****************** All student-data component logic ends here **************************************************/          

   getCounsellor(){
     this.counsellor = [];
     for(let i=0;i<this.members.length;i++){
       if(this.members[i].role == "Admin"){
         this.counsellor.push(this.members[i].name) 
       }
     }
    // console.log(this.counsellor);
   }

  getDataByKey(){
    return this.http.get(this.baseURL+this.activeStudentKey+".json?/auth=AIzaSyB97GEt7jzCFxAgvz6QRmxUlAK_PzJg6cs");
  }


  
/************** Getting data along with key ************/  
  getAllData(){
    //console.log("hey");
    this.memberList = this.db.list('Members');
    //console.log(this.memberList);
    return this.memberList;
  }

  getAllLeaveApplication(){
  //  console.log("getting...");
    this.applicationList = this.db.list('leave-application');
  //  console.log(this.applicationList);
    return this.applicationList;
  }
/************** Getting data along with key ends ************/
  insertCounsellor(name){
    
    this.memberList.update(this.activeStudentKey, {
      counsellor: name
    });
  }

  updateApplicationStatus(status,key){
    this.spinner.show() 
    this.applicationList.update(key, {
      status: status
    }).then(()=>{ 
      this.spinner.hide();
      this.toastr.info("","Status updated");
    });
  }


/*************************Logic for member sign up and validation*****************/
  isValidStudent:boolean=false;
  isValidAdmin:boolean=false;
  errorFlag: boolean= false;
  sameEmailError:string;
  sameEmailErrorFlag:boolean=false;

  emailVerification(email:string){
    for(let i=0;i<this.members.length;i++){
      if(email == this.members[i].email){
        this.sameEmailErrorFlag = true;
        this.sameEmailError="Email is already used!!!";
        break;     
      }else{
        this.sameEmailErrorFlag = false;
      }
    }
  }

   insertStudent( mem : Member)
   {
     this.memberList.push({
       name: mem.name,
       email: mem.email,
       password: mem.password,     
       role:mem.role, 
       counsellor:"null"
     });
   
     if(mem.role == "Student"){
      // alert("student called");
      this.isValidStudent=true;
      this.router.navigate(['students',mem.name]);
    }
     else{
      //alert("admin called");
      this.isValidAdmin=true;
      this.router.navigate(['admin',mem.name]);
     }
   }

   validateSignUpMember(member){
     //console.log(member.name);
     var flag=0; 
     for(let i=0;i<this.members.length;i++){
      if(member.email == this.members[i].email){
        flag++;
      } 
     //}
   }
   if(flag==0){
     this.insertStudent(member);
   }
   else{
     this.errorFlag=true;
     this.sameEmailError="Email is already used!!!"; 
     // alert("Same Email!!!");
   }
  }

/********************************* Logic ends here ***************************/  

/******************** Logic of member log in and validation ******************/

inValidCredentials:string;
authErrorFlag:boolean=false;

validatLogInMember(member){
  //console.log(member);
  var flagLogIn=0;
 // console.log("flag initial:"+ " " +flagLogIn);
  for(let i=0;i<this.members.length;i++){
    if(member.email == this.members[i].email && member.password == this.members[i].password){
      if(this.members[i].role == "Student"){
       // alert("valid student");
        this.isValidStudent = true;
        this.router.navigate(['students',this.members[i].name]);
      }
      else{
      //  alert("valid admin");
      //  console.log(this.members[i].name);
        this.isValidAdmin = true;
        this.router.navigate(['admin',this.members[i].name]);
      }
      //console.log("breaks applied!!!!");
      break;
    }
    else{
      flagLogIn++;
    //  console.log("flag triggered:"+ " " +flagLogIn);
    }
  }
  if(flagLogIn>0){
   // alert("inisde error");
    this.authErrorFlag = true;
    this.inValidCredentials = "Entered credentials are incorrect!!!";
  }
}
/******************* Logic ends here  ***************************************/
}