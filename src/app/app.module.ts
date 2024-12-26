import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TraineesListComponent } from './features/trainees/trainees-list/trainees-list.component';
import { TraineesAddEditComponent } from './features/trainees/trainees-list/trainees-add-edit/trainees-add-edit.component';
import { ScoresComponent } from './features/scores/scores.component';
import { ProgramsModule } from './features/programs/programs.module';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
//scores
import { AddColumnComponent } from './features/scores/add-column/add-column.component';
import { CreateScoreCardComponent } from './features/scores/create-score-card/create-score-card.component';
import { ScoreCardComponent } from './features/scores/score-card/score-card.component';
import { ViewTopicComponent } from './features/scores/view-topic/view-topic.component';
import { ViewTraineeReportComponent } from './features/scores/view-trainee-report/view-trainee-report.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


//creating a constant array of all the modules
const uxModules = [
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatToolbarModule,
  MatTableModule,
  MatCardModule,
  RouterOutlet
];




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    TraineesListComponent,
    TraineesAddEditComponent,
    ScoresComponent,
    //scores
    ScoreCardComponent,
    CreateScoreCardComponent,
    AddColumnComponent,
    ViewTopicComponent,
    ViewTraineeReportComponent, 

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    ProgramsModule,
    RouterModule,
    uxModules,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
