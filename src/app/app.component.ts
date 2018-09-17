import { Component , OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Member } from "./member";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  constructor(private authentication: AuthService){}

  ngOnInit(){ 
  }
 
}
