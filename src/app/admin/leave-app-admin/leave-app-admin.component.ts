import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Member } from "../../member";
import { LeaveApp } from "../../leave-application";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { element } from 'protractor';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-leave-app-admin',
  templateUrl: './leave-app-admin.component.html',
  styleUrls: ['./leave-app-admin.component.css']
})
export class LeaveAppAdminComponent implements OnInit {

  matchedStudentData:any[];
  Student:Member[];
  CounsellorName:string[];
  leaveApplication:any[];
  associatedStudentKey:any[]=[];
  public isHidden:boolean[]=[];
  isHiddenStatus:boolean[]=[];
  applicationDataBykey: LeaveApp[];
  applicationToUpdateKey:string;
  matchedApplication:any[];
  isEmptyApplication:boolean;
  isURLNull:boolean[]=[];

  index;
  

  constructor(private spinner : NgxSpinnerService ,private authservice : AuthService,private db:AngularFireDatabase) { 

  }


  show(index){ 
    this.isHidden[index] = false; 
  }

  hide(index){
    this.isHidden[index] = true;
  }

  set(){
     for(let i=0;i<this.matchedApplication.length;i++){
      this.isHidden[i]=true;
      this.isHiddenStatus[i] = true;
    }
  //  console.log(this.isHidden);
  //  console.log(this.isHiddenStatus)
  }

  editStatus(index){
    //console.log("select:",index);
    //console.log("id",this.matchedApplication[index].id);
    this.isHiddenStatus[index] = !this.isHiddenStatus[index];
    for(let i=0;i<this.applicationDataBykey.length;i++){
     // console.log("i:",i);
      if(this.matchedApplication[index].uniqueId == this.applicationDataBykey[i].uniqueId){
       // console.log(this.matchedApplication[index].uniqueId,"matched",this.applicationDataBykey[i].uniqueId);
        this.applicationToUpdateKey = this.applicationDataBykey[i].$key;      
      }
    }
   // console.log(this.applicationToUpdateKey);
  }
 
  update(status){
   // console.log(this.applicationDataBykey);
   // console.log(status.value);
    this.authservice.updateApplicationStatus(status.value.status,this.applicationToUpdateKey);
  }


  ngOnInit() {
    this.authservice.getStudentData();
    this.spinner.show()
        
    
    var lists = this.authservice.getAllData();
    var application = this.authservice.getAllLeaveApplication();

    application.snapshotChanges().subscribe(item => {
      this.applicationDataBykey = [];
      item.forEach(element =>{
        var mem = element.payload.toJSON();
        mem["$key"] = element.key;
        this.applicationDataBykey.push( mem as LeaveApp); 
      });
    }); 
   
/********************************* Finds students associated with counsellor *********************/
    lists.snapshotChanges().subscribe(item => {
      this.Student = [];
      item.forEach(element =>{
        var mem = element.payload.toJSON();
        mem["$key"] = element.key;
        this.Student.push( mem as Member); 
      }); 
      for(let i=0;i<this.Student.length;i++){
        //console.log(this.Student[i].counsellor);
        if(this.authservice.activeAdminName == this.Student[i].counsellor){
       //   this.associatedStudentKey=[];
          this.associatedStudentKey.push(this.Student[i].$key);
         // alert(this.Student[i].name+" "+this.Student[i].$key);
        }
      }
      
    //    console.log(this.matchedApplication);
    }); 
/********************************* Finds students associated with counsellor (Ends) *********************/


/********************************* compares every application to the each student under counsellor *********************/ 
    this.db.list('/leave-application').valueChanges().subscribe(list =>{  
      this.leaveApplication=list;
      this.matchedApplication=[];
      
    //  console.log("leave application:",this.leaveApplication);
    //  console.log("students:",this.associatedStudentKey);

     //   this.matchedApplication = []; 
     //   console.log("matched:",this.matchedApplication);
        for(let i=0;i<this.leaveApplication.length;i++)
          {
      //      console.log("value of i",i);
      //      console.log(this.leaveApplication[i].id);
              for(let j=0;j<this.associatedStudentKey.length;j++)
                {
      //            console.log("value of j",j);
      //            console.log(this.associatedStudentKey[j]);
                    if(this.leaveApplication[i].id == this.associatedStudentKey[j])
                      {
      //                   console.log(this.leaveApplication[i].id+" " +"Matched"+" "+this.associatedStudentKey[j]);
      //                   console.log(this.leaveApplication[i]);
                         this.matchedApplication.push(this.leaveApplication[i]);
                         this.set();
                      }
                }
          }
  
      for(let i=0;i<this.matchedApplication.length;i++){
        this.matchedApplication[i].content = this.matchedApplication[i].content.replace(new RegExp('\n', 'g'), "<br>");
        if(this.matchedApplication[i].Url == "null"){
      //    console.log("empty");
          this.isURLNull[i]=true;
        }
      }
      if(this.matchedApplication.length>0){
        this.isEmptyApplication = false;
      }  else
      {
        this.isEmptyApplication = true;
      }
    //  console.log(this.matchedApplication);
    this.spinner.hide();

  }); 

/********************************* compares every application to the each student under counsellor(Ends) *********************/ 

      this.matchedStudentData = this.authservice.matchedStudentData;
    //  console.log(this.matchedStudentData);

  }

}
