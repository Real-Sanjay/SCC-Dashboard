import { Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ScoresService } from 'src/app/core/services/scores.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { SnackBarService } from 'src/app/core/services/snackBar.service';

@Component({
  selector: 'app-create-score-card',
  standalone:false,
  templateUrl: './create-score-card.component.html',
  styleUrls: ['./create-score-card.component.scss']
})
export class CreateScoreCardComponent implements OnInit{
  
  //form
  scoreCardForm: FormGroup=new FormGroup({});

  constructor(private fb: FormBuilder,private scorecardservice: ScoresService,
   private snackBar: SnackBarService,
    private dialogRef:MatDialogRef<CreateScoreCardComponent>,
    @Inject(MAT_DIALOG_DATA)public data:any
  ) {}

  ngOnInit(): void {
    this.scoreCardForm = this.fb.group({
      topicName: ['', Validators.required],
      totalMarks: [0, [Validators.required, Validators.min(0)]],
      SCCTrainee: this.fb.array([this.createTrainee()],Validators.required)
    });

    //getting id from parent compoennent Scorecard component

    if (this.data.id) {
      this.scorecardservice.getScoreCardById(this.data.id).subscribe(card => {
        if (card) {
          this.scoreCardForm.patchValue({
            topicName: card.topicName,
            totalMarks: card.totalMarks
          });
    
          // Clear the existing form array
          const traineesFormArray = this.scoreCardForm.get('SCCTrainee') as FormArray;
          traineesFormArray.clear();
    
          // Add each trainee to the form array
          card.SCCTrainee.forEach((trainee:any )=> {
            traineesFormArray.push(this.fb.group({
              traineeName: trainee.traineeName,
              assessmentScore: trainee.assessmentScore,
              percentage: trainee.percentage
            }));
          });
        }
      });
    }

    // if(this.data.id){
    //   this.scorecardservice.getScoreCardById(this.data.id).subscribe(card=>{
    //     this.scorecard=card;
    //     if(card){
    //       this.scoreCardForm.patchValue(card);
    //       this
    //     }
    //   });
    // }

  }

  //creating [trainee name,Assessment score, percentage]
  createTrainee(): FormGroup {
    return this.fb.group({
      traineeName: ['', Validators.required],
      assessmentScore: [0, [Validators.required, Validators.min(0)]],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  get SCCTrainee(): FormArray {
    return this.scoreCardForm.get('SCCTrainee') as FormArray;
  }
  
   //To add one more row
  addTrainee(): void {
    this.SCCTrainee.push(this.createTrainee());
  }

  //To pop() last row
  removeTopic(index: number): void {
    this.SCCTrainee.removeAt(index);
  }

  //Dynamically calculating the percentage based on total marks and Assessment score.
  calculatePercentage(index: number): void {
    const totalMarks = this.scoreCardForm.get('totalMarks')?.value;
    const assessmentScore = this.SCCTrainee.at(index).get('assessmentScore')?.value;
    const percentage = totalMarks ? (assessmentScore / totalMarks) * 100 : 0;
    this.SCCTrainee.at(index).get('percentage')?.setValue(percentage.toFixed(2));
  }
  recalculatePercentages(): void {
    this.SCCTrainee.controls.forEach((_, index) => this.calculatePercentage(index));
  }


  savePost(): void {

    let flag: boolean=false;
    if (this.scoreCardForm.valid) {

      if (this.data && this.data.id) {
              this.scorecardservice.updateScoreCard(this.data.id, this.scoreCardForm.value).subscribe(() => {
                console.log('Score card updated Successfully');
                this.snackBar.openSnackBar('Score card updated', 'Success');
                this.dialogRef.close(true);
              }, error => {
                console.error('Error updating score card:', error);
                this.snackBar.openSnackBar('Error updating score card', 'Update Failed');
              });
            }
      else{
        this.scorecardservice.getScoreCard().subscribe({
          next:(data)=>{
            data.forEach((topic:any)=>{
              if(this.scoreCardForm.value.topicName==topic.topicName){
                console.log('score card exists');
                flag=true;
              }
            });
            if(flag){
              this.snackBar.openSnackBar('Score card already exists', 'failed');
            }else{
              this.scorecardservice.createScoreCard(this.scoreCardForm.value).subscribe({
                next: (response) => {
                  this.snackBar.openSnackBar('Score card saved successfully', 'Success');
                  this.dialogRef.close(true);
                  console.log("refernce passed!")
                },
                error: (error) => {
                  console.error('Error saving score card:', error);
                  this.snackBar.openSnackBar('Error saving score card, Please try again', 'Save Failed');
                }
              });
            }
          }
        }); 
      } 
    } else {
      this.snackBar.openSnackBar('Score card is Invalid', 'Save Failed');
    }
  }
  

//Saves data to database
  // savePost(): void {
  //   if (this.scoreCardForm.valid) {
  //     if (this.data) {
  //       this.scorecardservice.updateScoreCard(this.data.id, this.scoreCardForm.value).subscribe({
  //         next: (res) => {
  //           console.log("Scores added!", res);
  //           this.snackBar.openSnackBar('Scores updated', 'success');
  //           this.dialogRef.close(true); // Explicitly close with true
  //         },
  //         error: (error) => {
  //           console.log("error occurred updating scores", error);
  //           this.snackBar.openSnackBar('Failed to update', 'Failed');
  //           this.dialogRef.close(false); // Close with false on error
  //         }
  //       });
  //     } else {
  //       this.scorecardservice.createScoreCard(this.scoreCardForm.value).subscribe({
  //         next: (res) => {
  //           console.log("Score saved successfully", res);
  //           this.snackBar.openSnackBar('Scores added!', 'success');
  //           console.log("About to close dialog with true");
  //           this.dialogRef.close(true);  // Verify this is called
  //           console.log("Dialog closed");
  //         },
  //         error: (error) => {
  //           console.log('Error saving scores', error);
  //           this.snackBar.openSnackBar('Error saving scores','failed');
  //           this.dialogRef.close(false);
  //         }
  //       });
  //     }
  //   } else {
  //     this.snackBar.openSnackBar('Score card is Invalid', 'Save Failed');
  //     // Don't close the dialog if form is invalid
  //   }
  // }
}
