import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { NgxSpinnerService } from 'ngx-spinner';
import { LeaveApp } from '../leave-application';
import { trigger, transition, animate, style } from '@angular/animations';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-student-leave-app',
  templateUrl: './student-leave-app.component.html',
  styleUrls: ['./student-leave-app.component.css'], 
})
export class StudentLeaveAppComponent implements OnInit {

  id:string;
  status:string;
  uniqueId:string;
  applicationList:AngularFireList<any>;
  list:any[];
  newList:any[];
  lengthCheck;
  isListEmpty:boolean;
  file:File;
  private basePath:string = '/uploads';
  uploads: AngularFireList<any>;
  Url:string;
  fileLength=0;
  progress;
  truthValue:boolean=false;
  studentDataByKey:any;
  application:LeaveApp[];
  applicationId;
 
  constructor(private spinner : NgxSpinnerService ,private authservice:AuthService,private toastr: ToastrService ,private db:AngularFireDatabase) {
    this.applicationList = db.list('/leave-application');
    //this.spinner.show();
    db.list(`/leave-application`).valueChanges().subscribe(list =>{  
      this.list=list;
     // console.log(this.list);
      this.newList = [];
      for(let i=0;i<this.list.length;i++){
        if(this.authservice.activeStudentKey == this.list[i].id){
          this.newList.push(this.list[i]);
        }
      }

      for(let i=0;i<this.newList.length;i++){
        this.newList[i].content = this.newList[i].content.replace(new RegExp('\n', 'g'), "<br>");
      }
 
      this.lengthCheck = this.newList.length;
      if(this.lengthCheck > 0){
        this.isListEmpty = false;
      }
      else{
        this.isListEmpty = true;
      }

     // console.log(this.newList);
     }
     );
  }

  ngOnInit() {
   // console.log(this.authservice.activeStudentKey);
   //this.spinner.hide();
   var application = this.authservice.getAllLeaveApplication();

    application.snapshotChanges().subscribe(item => {
      this.application = [];
      item.forEach(element =>{
        var mem = element.payload.toJSON();
        mem["$key"] = element.key;
        this.application.push( mem as LeaveApp); 
      });
    });
    this.authservice.getDataByKey().subscribe(res=>{
      this.studentDataByKey = res.json(); 
      //console.log(this.studentDataByKey)  
     },(error)=>console.log(error))
  }

  submitApplication(data){
    this.id = this.authservice.activeStudentKey;
    this.status = "Pending";
    this.uniqueId = this.id + Math.floor(Math.random()*10000);
    let date = new Date(); 
    //console.log(data.value);
     if(this.fileLength==0){
      this.Url="null";
     // console.log(this.fileLength);
     // console.log(this.Url);
     } 
    this.authservice.submitApplication(
      data.value,this.id,
      this.status,this.Url,
      this.studentDataByKey.name,
      this.studentDataByKey.email,
      this.uniqueId , date
      );
    //console.log(this.Url);
  }

  deleteApplication(index){

    for(let i=0;i<this.application.length;i++){
      if(this.newList[index].uniqueId == this.application[i].uniqueId){
        this.applicationId = this.application[i].$key;
        this.db.list(`/leave-application/${this.applicationId}`).remove().then(()=> {
          this.toastr.warning("Application Deleted");
        });
        break;
      }
    }

  }

  trigger(){
    var upload =document.getElementById("file");
    upload.click();
  }

  deleteFile(){
    let storageRef = firebase.storage().ref();
    let deleteTask = storageRef.child(`${this.authservice.activeStudentKey}/${this.file.name}`);
    this.spinner.show();
    deleteTask.delete().then( ()=>{
      this.toastr.error("Attachment Removed");
      this.spinner.hide();
    });
  }

  fileSelected(event:any){
    
    this.file = event.target.files[0];
    
      this.fileLength = event.target.files.length;

    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.authservice.activeStudentKey}/${this.file.name}`).put(this.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
      //  console.log("uploading the file...");
        this.truthValue=true;
        this.progress = Math.floor((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100);
      },
      (error)=>{
       // console.log(error);
      },
      () =>{
   //     this.Url = uploadTask.snapshot.downloadURL;
   //     console.log(uploadTask.snapshot.downloadURL);
        storageRef.child(`${this.authservice.activeStudentKey}/${this.file.name}`).getDownloadURL().then(url =>{
          this.Url = url;
       //   console.log(this.Url);
        }); 
      }
    );
  }

  
}
