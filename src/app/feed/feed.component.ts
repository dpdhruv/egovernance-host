import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import {StudentsComponent} from '../students/students.component';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  isEmptyFeed:boolean=true;
  post:AngularFireList<any>;
  posts:any[];
  show:boolean=false;
  isFeed:boolean=false;
  user_id:string; 
  constructor(private toastr: ToastrService,private route:ActivatedRoute,private db:AngularFireDatabase,private authservice:AuthService,private student:StudentsComponent) { 
  }

  ngOnInit() {
    let uname=this.route.snapshot.params['user_id'];
    this.user_id= uname;

    this.post=this.db.list('/Posts');
    this.db.list('/Posts').valueChanges().subscribe(posts =>{  
      this.posts=posts;
      
      if(this.posts.length > 0){
         this.isFeed=true;
         this.isEmptyFeed=false;
      }else{
        this.isEmptyFeed=true;
      }

      for(let i=0;i<this.posts.length;i++){
        this.posts[i].content=this.posts[i].content.replace(new RegExp('\n', 'g'), "<br>");
      }
      
   //   console.log(this.members);
   });
    }

  submitPost(post){
    //alert("Content:"+post.value);
    var date = new Date();
   // alert(date)
   var button = document.getElementById("close-button");
  
     this.post.push({
      content:post.value,
      name:this.user_id,
      date:date.toUTCString()
    }).then(()=>{button.click();
    this.toastr.success("Post Submitted")
    });
    
  }

}
