import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Member } from "../../member";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.css']
})
export class StudentDataComponent implements OnInit {

  isEmpty:boolean=false;
  constructor(private spinner : NgxSpinnerService ,private authservice : AuthService) { }

  matchedStudentData:any[];

  ngOnInit() {
 this.authservice.getStudentData();





 this.matchedStudentData = this.authservice.matchedStudentData;
 if(this.matchedStudentData.length == 0){
   this.isEmpty = true; 
  }
}

}
