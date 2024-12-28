import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProgarmsListComponent } from './features/programs/progarms-list/progarms-list.component';
import { ProgramsAddEditComponent } from './features/programs/progarms-list/programs-add-edit/programs-add-edit.component';
import { TrainersListComponent } from './features/trainers/trainers-list/trainers-list.component';
import { TrainersAddEditComponent } from './features/trainers/trainers-list/trainers-add-edit/trainers-add-edit.component';
import { TraineesListComponent } from './features/trainees/trainees-list/trainees-list.component';
import { TraineesAddEditComponent } from './features/trainees/trainees-list/trainees-add-edit/trainees-add-edit.component';
import { ScoresComponent } from './features/scores/scores.component';

import { HighchartsChartModule } from 'highcharts-angular';


//creating a constant array of all the modules
const uxModules = [
  MatCardModule,
  MatGridListModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatToolbarModule,
  RouterOutlet
];




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ProgarmsListComponent,
    ProgramsAddEditComponent,
    TrainersListComponent,
    TrainersAddEditComponent,
    TraineesListComponent,
    TraineesAddEditComponent,
    ScoresComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    HighchartsChartModule,
    HttpClientModule,
    uxModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
