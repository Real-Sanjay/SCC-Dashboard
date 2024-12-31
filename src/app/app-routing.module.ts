import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ProgarmsListComponent } from './features/programs/progarms-list/progarms-list.component';
import { TraineesListComponent } from './features/trainees/trainees-list/trainees-list.component';
import { TrainersListComponent } from './features/trainers/trainers-list/trainers-list.component';
import { ProgramsAddEditComponent } from './features/programs/progarms-list/programs-add-edit/programs-add-edit.component';
import { TraineesAddEditComponent } from './features/trainees/trainees-list/trainees-add-edit/trainees-add-edit.component';
import { TrainersAddEditComponent } from './features/trainers/trainers-list/trainers-add-edit/trainers-add-edit.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

const routes: Routes = [
  {path: '', component:HeaderComponent,

    children: [
      {path:'program-list', component:ProgarmsListComponent},
      {path:'trainers-list', component:TrainersListComponent},
      {path:'dashboard', component:DashboardComponent},
    
    ]
  }, 


  
  // {path:'program-add-edit', component:ProgramsAddEditComponent},
  // ,
  // {path:'trainers-add-edit', component:TrainersAddEditComponent},
  // {path:'trainees-list', component:TraineesListComponent},
  // {path:'trainees-add-edit', component:TraineesAddEditComponent},


  // { path: '**', component: HeaderComponent } 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
