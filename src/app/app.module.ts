import { BrowserModule } from '@angular/platform-browser';
//import { BrowserAnimationsModule } from "@angular/platform-browser";
import { NgModule } from '@angular/core';
import { AppRoutingModule,routingComponents } from "./app-routing.module";
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from 'angularfire2/auth';
//import {ToasterModule, ToasterService} from 'angular5-toaster';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
//import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToastrModule } from "ngx-toastr";
import { LoadingModule } from 'ngx-loading';
import 'firebase/storage';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AuthService } from "./auth.service";
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { AuthGuard } from "./guards/auth.guard";
import { StudentLeaveAppComponent } from './student-leave-app/student-leave-app.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { StudentDataComponent } from './admin/student-data/student-data.component';
import { LeaveAppAdminComponent } from './admin/leave-app-admin/leave-app-admin.component';
import { FeedComponent } from './feed/feed.component';
import { StudentsComponent } from './students/students.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    SignUpComponent,
    LogInComponent,
    StudentLeaveAppComponent,
    StudentProfileComponent,
    StudentDataComponent,
    LeaveAppAdminComponent,
    FeedComponent
    ],
  imports: [
    BrowserModule,
     HttpModule,
    AppRoutingModule,
    FormsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LoadingModule,
    NgxSpinnerModule,
   // PdfViewerModule
   // AngularFirestore
  ],
  providers: [AuthService,AuthGuard,StudentsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
