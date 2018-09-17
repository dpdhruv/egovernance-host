import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { Member } from "../member";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public userName;
  members:Member[];
  public activeAdmin;
  public activeAdminKey;

  constructor(private route:ActivatedRoute,private toastr : ToastrService,private router:Router,db:AngularFireDatabase,private authservice :AuthService) { 
    
  }

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
      for(let i=0;i<this.members.length;i++){
        if(this.userName == this.members[i].name){
          this.activeAdmin = this.members[i];
          this.activeAdminKey = this.members[i].$key;
        }
      }
      this.authservice.activeAdminKey = this.activeAdminKey;
      this.authservice.activeAdminName = this.userName;
    });
    this.toastr.success('You have logged in',this.userName);
  }

  navigateTo(){
    this.router.navigate(['student-data'],{relativeTo:this.route})
  }
  home(){
    this.router.navigate(['feed',this.userName],{relativeTo:this.route});
  }

  leaveAppDashboard(){
    this.router.navigate(['leave-app-dashboard'],{relativeTo:this.route});
  }
  logout(){
    this.authservice.isValidAdmin = false;
    this.router.navigate(["login"]).then(()=> this.toastr.success("You have logged out"));
  }
}
