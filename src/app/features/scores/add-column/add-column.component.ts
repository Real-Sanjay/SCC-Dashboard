import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ScoresService } from 'src/app/core/services/scores.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { SnackBarService } from 'src/app/core/services/snackBar.service';

@Component({
  selector: 'app-add-column',
  standalone:false,
  templateUrl: './add-column.component.html',
  styleUrls: ['./add-column.component.scss']
})
export class AddColumnComponent implements OnInit {

  scorecard: any[] = [];
  AddColumnForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private scorecardservice: ScoresService, private router: Router,
    private snackBar: SnackBarService,
    private dialog:MatDialogRef<ScoreCardComponent>, @Inject(MAT_DIALOG_DATA)public d:{id:string}
  ) {}

  ngOnInit(): void {
    this.AddColumnForm = this.fb.group({
      topicName: ['', Validators.required],
      totalMarks: [0, [Validators.required, Validators.min(0)]],
      SCCTrainee: this.fb.array([])
    });
    this.loadScoreCards();
  }

  createTrainee(traineeName: string): FormGroup {
    return this.fb.group({
      traineeName: [traineeName, Validators.required],
      assessmentScore: [0, [Validators.required, Validators.min(0)]],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  //To add new Trainee when clicked on Add Trainee Button
  addTrainee(): void {
    this.SCCTrainee.push(this.createTrainee(''));
  }
  //To remove Trainee when clicked on Remove Trainee Button
  removeTrainee(index: number): void {
    this.SCCTrainee.removeAt(index);
  }

  //It loads scores data from Database(stroed in MongoDB) and populate trainee names inside form 
  loadScoreCards() {
    this.scorecardservice.getScoreCard().subscribe({
      next: (data) => {
        this.scorecard = data;
        this.populateForm();
        console.log('Loaded score cards successfully.');
      },
      error: (error) => {
        console.error('There is an error!', error);
      }
    });
  }

  get SCCTrainee(): FormArray {
    return this.AddColumnForm.get('SCCTrainee') as FormArray;
  }

    //to fetch Trainee Name details in Add Column Form
  populateForm() {
    this.SCCTrainee.clear();
    if (this.scorecard.length > 0) {
      this.scorecard[0].SCCTrainee.forEach((trainee: any) => {
        this.SCCTrainee.push(this.createTrainee(trainee.traineeName));
      });
    }
  }

  // Automatic calculation of percentage when value is entered in Assessment score
  calculatePercentage(index: number): void {
    const totalMarks = this.AddColumnForm.get('totalMarks')?.value;
    const assessmentScore = this.SCCTrainee.at(index).get('assessmentScore')?.value;
    const percentage = totalMarks ? (assessmentScore / totalMarks) * 100 : 0;
    this.SCCTrainee.at(index).get('percentage')?.setValue(percentage);
  }

  onSubmit(): void {
    console.log(this.AddColumnForm.value);
    // Handle form submission logic here
    //optional
  }

  // On clicking save button, it saves new topic with trainee scores in database.
  savePost() {
    let flag: boolean=false;
      if (this.AddColumnForm.valid) {
        //Logic for checking topic name exists or not
        this.scorecardservice.getScoreCard().subscribe({
          next:(data)=>{
            data.forEach((topic:any)=>{
              if(this.AddColumnForm.value.topicName==topic.topicName){
                console.log('score card exists');
                flag=true;
              }
            });
            if(flag){
              this.snackBar.openSnackBar('Topic already exists', 'failed');
              this.dialog.close(true);
              this.loadScoreCards();
            }else{
              this.scorecardservice.createScoreCard(this.AddColumnForm.value).subscribe({
                next:(response)=>{
                  this.dialog.close(true);
                  this.loadScoreCards();
                  this.snackBar.openSnackBar('Column Added successfully', 'Success');
                },
                error:(error)=>{
                  alert('Error Saving Score card, Please try again');
                }
              });
            }
          }
        });
      } else {
        this.snackBar.openSnackBar('Score card is Invalid', 'Save Failed');
      }
  }
}
