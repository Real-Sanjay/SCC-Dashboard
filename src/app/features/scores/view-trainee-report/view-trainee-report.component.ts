import { Component,OnInit, Optional } from '@angular/core';
import { ScoresService } from 'src/app/core/services/scores.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-trainee-report',
  standalone:false,
  templateUrl: './view-trainee-report.component.html',
  styleUrls: ['./view-trainee-report.component.scss']
})
export class ViewTraineeReportComponent implements OnInit{

  scorecard: any ;
  student:any={};
  topics: any[] = [];

  constructor(
      private scorecardservice: ScoresService,
      private activatedroute: ActivatedRoute,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: { name: string },
      private dialogRef: MatDialogRef<ViewTraineeReportComponent>
    ) {
      if (data) {
        // console.log('Received name:', data.name);
        this.scorecardservice.getScoreCard().subscribe(card=>{
          this.topics = card.map((topic: any) => ({ names: topic.topicName, _id:topic._id}));
          this.scorecard=this.processData(card,data.name);
          this.scorecard.forEach((trainee:any)=>{
            if(trainee.traineeName==data.name){
            this.student=trainee;
            this.topics.forEach((topic:any)=>{
              // let var=topic.names
              console.log(this.student[topic.names+'Score']);
            });
            console.log((this.student.traineeName));
            }
          })
          // console.log(typeof(this.scorecard));
        });
      }
    }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

    processData(data: any[],name:string): any[] {
      const traineeMap: any = {};
  
      data.forEach(topic => {
        topic.SCCTrainee.forEach((trainee: any) => {
          if (!traineeMap[trainee.traineeName]) {
            traineeMap[trainee.traineeName] = 
            { traineeName: trainee.traineeName, overallScore: 0, overallPercentage: 0, rank: 0, totalscore:0 };
          }
          traineeMap[trainee.traineeName].totalscore+=topic.totalMarks;
          traineeMap[trainee.traineeName]['_id'] = topic._id;
          traineeMap[trainee.traineeName][topic.topicName + 'Score'] = trainee.assessmentScore;
          traineeMap[trainee.traineeName][topic.topicName + 'Percentage'] = trainee.percentage;
          traineeMap[trainee.traineeName].overallScore += trainee.assessmentScore;
          traineeMap[trainee.traineeName].overallPercentage += trainee.percentage;
        });
      });
      const trainees = Object.values(traineeMap);
      
    trainees.forEach((trainee: any) => {
      trainee.overallPercentage = parseFloat(((trainee.overallScore/ trainee.totalscore)*100).toFixed(2));
    });

      return trainees;
    }

    closeDialog() {
      this.dialogRef.close();  
    }

}