import { NgModule  } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { StudentsComponent } from './students/students.component';
import { AdminComponent } from "./admin/admin.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { LogInComponent } from './log-in/log-in.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from "./guards/admin.guard";
import { StudentLeaveAppComponent } from './student-leave-app/student-leave-app.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { StudentDataComponent } from './admin/student-data/student-data.component';
import { LeaveAppAdminComponent } from './admin/leave-app-admin/leave-app-admin.component';
import { FeedComponent } from './feed/feed.component';

const routes: Routes = [
    { path: 'students/:uname' ,
      canActivate:[AuthGuard],
      component: StudentsComponent, 
      children: [
        {path:'leave-application',component:StudentLeaveAppComponent},
        {path:'profile',component:StudentProfileComponent},
        {path:'feed/:user_id',component:FeedComponent}
      ]  
    },
    { path:'admin/:uname',
      canActivate:[AdminGuard],
      component: AdminComponent,
      children:[
        {path:'student-data',component:StudentDataComponent},
        {path:'leave-app-dashboard',component:LeaveAppAdminComponent},
        {path:'feed/:user_id',component:FeedComponent}
      ]
    },
    { path:'',component:SignUpComponent},
    { path:'login', component:LogInComponent}
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [StudentsComponent, AdminComponent]