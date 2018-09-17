import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { Member } from "../member";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
public userName;

members: Member[];



public activeLink:boolean=false;
public activeStudent;
public activeStudentKey;
  constructor(private route:ActivatedRoute,private toastr : ToastrService,private router:Router,db:AngularFireDatabase,private authservice :AuthService,) {  
                  
  }
 public data;
  ngOnInit() {
    let uname=this.route.snapshot.params['uname'];
    this.userName=uname;
    this.router.navigate(['feed',this.userName],{relativeTo:this.route});
    var list = this.authservice.getAllData();

    list.snapshotChanges().subscribe(item => {
      this.members = [];
      item.forEach(element =>{
        var mem = element.payload.toJSON();
        mem["$key"] = element.key;
        this.members.push( mem as Member); 
      });
      //console.log(this.members[0]);
      for(let i=0;i<this.members.length;i++){
        if(this.userName == this.members[i].name){
          this.activeStudent = this.members[i];
          this.activeStudentKey = this.members[i].$key;
        }
      }
  this.authservice.activeStudentKey = this.activeStudentKey;
    }); 
    this.toastr.success('You have logged in',this.userName);
    }

    navigateToProfile(){
      this.router.navigate(['profile'],{relativeTo:this.route});
    }

    navigateToLeaveApp(){
    //  this.activeLink=true;
      this.router.navigate(['leave-application'],{relativeTo:this.route});
    }

    home(){
      this.router.navigate(['feed',this.userName],{relativeTo:this.route});
    }

    logout(){
      this.authservice.isValidStudent = false;
      this.router.navigate(['login']).then(()=>this.toastr.success("You have logged out"));
    }

  
}
