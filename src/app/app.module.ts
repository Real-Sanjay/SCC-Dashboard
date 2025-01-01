import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
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
import { ScoresModule } from './features/scores/scores.module';

//creating a constant array of all the modules
const uxModules = [
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
    TraineesListComponent,
    TraineesAddEditComponent,
    ScoresComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    ProgramsModule,
    MatCardModule,
    ScoresModule,
    uxModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
