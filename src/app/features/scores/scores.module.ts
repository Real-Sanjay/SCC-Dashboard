import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddColumnComponent } from './add-column/add-column.component';
import { CreateScoreCardComponent } from './create-score-card/create-score-card.component';
import { ScoreCardComponent } from './score-card/score-card.component';
import { ViewTopicComponent } from './view-topic/view-topic.component';
import { ViewTraineeReportComponent } from './view-trainee-report/view-trainee-report.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    AddColumnComponent,
    CreateScoreCardComponent,
    ScoreCardComponent,
    ViewTopicComponent,
    ViewTraineeReportComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCardModule,
    MatTableModule
  ],
  exports:[ScoreCardComponent]
})
export class ScoresModule { }
