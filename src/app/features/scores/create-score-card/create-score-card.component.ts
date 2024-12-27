import { Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ScoresService } from 'src/app/core/services/scores.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScoreCardComponent } from '../score-card/score-card.component';

@Component({
  selector: 'app-create-score-card',
  standalone:false,
  templateUrl: './create-score-card.component.html',
  styleUrls: ['./create-score-card.component.scss']
})
export class CreateScoreCardComponent implements OnInit{
  
  scoreCardForm: FormGroup=new FormGroup({});

  constructor(private fb: FormBuilder,private scorecardservice: ScoresService,
    private router:Router,private activatedroute:ActivatedRoute,private dialogRef :MatDialogRef<CreateScoreCardComponent>,
    @Inject(MAT_DIALOG_DATA)public data:any,private dialog:MatDialogRef<ScoreCardComponent>,
    @Inject(MAT_DIALOG_DATA)public d:{id:string}
  ) {}

  ngOnInit(): void {
    this.scoreCardForm = this.fb.group({
      topicName: ['', Validators.required],
      totalMarks: [0, [Validators.required, Validators.min(0)]],
      SCCTrainee: this.fb.array([this.createTrainee()])
    });

    let id=this.activatedroute.snapshot.paramMap.get('id');

    if(id){
      this.scorecardservice.getScoreCardById(id).subscribe(card=>{
        if(card){
          this.scoreCardForm.patchValue(card);
        }
      })
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

  // creating Score card and saving
  savePost() {
    let id=this.activatedroute.snapshot.paramMap.get('id');
    
    if(id){
      this.scorecardservice.updateScoreCard(id,this.scoreCardForm.value).subscribe(()=>{
        console.log('Score crad updated Successfully');
        this.router.navigate(['/scorec'])
        this.dialogRef.close(true);
      })
    }else{
      this.scorecardservice.createScoreCard(this.scoreCardForm.value).subscribe({
        next:(response)=>{
          alert('Score Card Saved Successfully');
          this.dialogRef.close(true);
          // console.log('successful');
          this.router.navigate(['/scorec'])
        },
        error:(error)=>{
          alert('Error Saving Score card, Please try again');
        }
      });
    }

   
  }

}
