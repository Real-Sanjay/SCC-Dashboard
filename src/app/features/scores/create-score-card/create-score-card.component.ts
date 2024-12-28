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
  
  scoreCardForm: FormGroup=new FormGroup({});

  constructor(private fb: FormBuilder,private scorecardservice: ScoresService,
    private router:Router,private activatedroute:ActivatedRoute,private snackBar: SnackBarService,
    private dialog:MatDialogRef<ScoreCardComponent>,
    @Inject(MAT_DIALOG_DATA)public d:any
  ) {}

  ngOnInit(): void {
    this.scoreCardForm = this.fb.group({
      topicName: ['', Validators.required],
      totalMarks: [0, [Validators.required, Validators.min(0)]],
      SCCTrainee: this.fb.array([this.createTrainee()],Validators.required)
    });

    //getting id from parent compoennent Scorecard component
    if(this.d.id){
      this.scorecardservice.getScoreCardById(this.d.id).subscribe(card=>{
        if(card){
          this.scoreCardForm.patchValue(card);
        }
      });
    }

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

  onSubmit(): void {
    // console.log(this.scoreCardForm.value);
  }

  savePost(): void {
    if (this.scoreCardForm.valid) {
      console.log('Form Valid:', this.scoreCardForm.valid);
      console.log('Form Value:', this.scoreCardForm.value);
  
      if (this.d && this.d.id) {
        this.scorecardservice.updateScoreCard(this.d.id, this.scoreCardForm.value).subscribe(() => {
          console.log('Score card updated Successfully');
          this.snackBar.openSnackBar('Score card updated', 'Success');
          this.dialog.close(true);
        }, error => {
          console.error('Error updating score card:', error);
          this.snackBar.openSnackBar('Error updating score card', 'Update Failed');
        });
      } 
      else {
        this.scorecardservice.createScoreCard(this.scoreCardForm.value).subscribe({
          next: (response) => {
            this.snackBar.openSnackBar('Score card saved successfully', 'Success');
            this.dialog.close(true);
          },
          error: (error) => {
            console.error('Error saving score card:', error);
            this.snackBar.openSnackBar('Error saving score card, Please try again', 'Save Failed');
          }
        });
      }
    } else {
      this.snackBar.openSnackBar('Score card is Invalid', 'Save Failed');
    }
  }
  
}
