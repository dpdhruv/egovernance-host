import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Member } from '../member';
import { AngularFireList } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
  animations:[
    trigger('enterLeave', [
        transition('void => *', [
            // 'From' Style
            style({ opacity: 0}),   
            animate('800ms ease-in',
              // 'To' Style
              style({ opacity: 1 }),     
            )
        ])
      ])
    ]
})
export class StudentProfileComponent implements OnInit {
memberList: AngularFireList<any>;
members:any;
edit:boolean=false;
//public loading=true;
counsellorName:any[];
flag:boolean=true;
activeStudent;
activeStudentCounsellor;
  constructor(private spinner : NgxSpinnerService ,private authservice:AuthService,private db:AngularFireDatabase,private toastr : ToastrService) {
   // this.spinner.show();    
    this.authservice.getCounsellor();
    this.counsellorName = this.authservice.counsellor;
  }
 

  
  ngOnInit() {
  
    //console.log(this.authservice.activeStudentKey);
    this.spinner.show();
  this.authservice.getDataByKey().subscribe(res =>{
  //  this.loading = false;
 
     this.activeStudent = res.json();
     this.activeStudentCounsellor = res.json().counsellor;

   //  console.log(this.activeStudentCounsellor);
     if(this.activeStudentCounsellor =="null"){
       this.flag = false;
     //  console.log(this.flag);
     }
     this.spinner.hide();
   });
    }
  updateCounsellor(form){
    //this.flag = true;
    this.authservice.insertCounsellor(form.value.name);
    this.toastr.info("","Counsellor name updated as" +" "+form.value.name);
    //this.activeStudent = this.form.value;
  }

  editCounsellorName(){
    this.edit = !this.edit;
  }
}
