import { Component,OnInit, Optional } from '@angular/core';
import { ScoresService } from 'src/app/core/services/scores.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-view-topic',
  standalone:false,
  templateUrl: './view-topic.component.html',
  styleUrls: ['./view-topic.component.scss']
})
export class ViewTopicComponent implements OnInit{

  scorecard:any;
  averagePercentage: string = '';

  constructor(
    private scorecardservice: ScoresService,
    private activatedroute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<ViewTopicComponent>
  ) {
    if (data) {
      console.log('Received id:', data.id);
      this.scorecardservice.getScoreCardById(data.id).subscribe(card=>{
        this.scorecard=card;
        console.log(this.scorecard.values);
        this.calculateAveragePercentage();
      });
    }
  }

  
  ngOnInit(): void {

    // let id=this.activatedroute.snapshot.paramMap.get('id');

    // if(id){
    //   this.scorecardservice.getScoreCardById(id).subscribe(card=>{
    //     this.scorecard=card;
    //     console.log(typeof(this.scorecard));
    //   });
    // }
    this.calculateAveragePercentage();
  }

  calculateAveragePercentage() {
    if (this.scorecard && this.scorecard.SCCTrainee) {
      const totalPercentage = this.scorecard.SCCTrainee.reduce((sum: any, trainee: any) => sum + trainee.percentage, 0);
      this.averagePercentage = (totalPercentage / this.scorecard.SCCTrainee.length).toFixed(2);
      console.log(this.averagePercentage);
    }
  }

  closeDialog() {
    this.dialogRef.close();  
  }
}