import { Component, Inject, OnInit } from '@angular/core';
import { ProgramService } from 'src/app/core/services/programs.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { __values } from 'tslib';
import {COMMA, ENTER} from '@angular/cdk/keycodes'
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/core/services/snackBar.service';


@Component({
  selector: 'app-programs-add-edit',
  templateUrl: './programs-add-edit.component.html',
  styleUrls: ['./programs-add-edit.component.scss']
})
export class ProgramsAddEditComponent implements OnInit {
  programForm: FormGroup<any>;
  // trainerNames: string[] = [];  // For later reference
  trainingModes:string[] = ['Online', 'Offline'];
  trainingStatus: string[] = ['Scheduled', 'Completed', 'Cancelled'];
  selectedStatus: string = 'Scheduled';
  topics:string[]  = [];
  separatorKeysCodes: number[] = [ENTER,COMMA];
  topicsControl = new FormControl([]);




  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    // private dialog: MatDialog, when using MatDialog
    private dialogRef: MatDialogRef<ProgramsAddEditComponent>,
    private snackBar: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data:any     // Inject data from the parent component              

  ) {
    // Initialize form in constructor
    this.programForm = this.fb.group({
      module: ['', Validators.required],
      topics: this.fb.array([], Validators.required),
      dayHour: [0, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      trainingMode: ['Online', Validators.required],
      trainer: ['', Validators.required],
      status: ['Scheduled', Validators.required],
      referenceNotes: [''],
    });
  }

  ngOnInit(): void {
    this.programForm.patchValue(this.data);
  }
// Not used now just for ref for future feature
  // private loadTrainerNames() {
  //   this.trainerService.getTrainerNames().subscribe({
  //     next: (names) => {
  //       this.trainerNames = names;
  //       console.log(this.trainerNames);
  //     },
  //     error: (error) => {
  //       console.error('Error loading trainer names:', error);
  //     }
  //   });
  // }
 
  private formatDate(date: Date): string {
    if (!date) return '';
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  private validateTime(time: string): string {
    // Basic time validation and formatting
    if (!time) return '';
    
    // If time is already in correct format (e.g., "11:00 AM"), return it
    if (/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(time)) {
      return time;
    }
    
    // If time needs formatting, return empty string
    return '';
  }



  onFormSubmit() {
    if (this.programForm.valid) {

      
      // Create a copy of the form values
      const formData = { ...this.programForm.value };

      // Format dates
      if (formData.startDate) {
        formData.startDate = this.formatDate(new Date(formData.startDate));
      }
      if (formData.endDate) {
        formData.endDate = this.formatDate(new Date(formData.endDate));
      }

      // Validate times
      formData.startTime = this.validateTime(formData.startTime);
      formData.endTime = this.validateTime(formData.endTime);

      // Log the formatted data
      console.log('Formatted form data:', formData);
           
       if(this.data){
      
        this.programService.updateProgram(this.data._id,formData).subscribe({
          next:(respons)=>{
            console.log('Program updated:', respons);
            
            this.snackBar.openSnackBar('Program updated', 'Success');
            this.dialogRef.close(true);

       },
       error:(error)=>{
         console.error('Error updating program:', error);
        this.snackBar.openSnackBar('error updating program', 'Failed')
      }});
    }
      
       else{
      
      // Submit to service
      this.programService.addProgram(formData).subscribe({
        next: (response) => {
          console.log("Program added successfully!", response);
          this.snackBar.openSnackBar('Program added', 'Success'); 
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving program:', error);
          alert('An error occurred while saving the program.');
        }
      });
    }
    } else {
      this.programForm.markAllAsTouched();
      console.log("Form is invalid");
      
      // Log validation errors
      Object.keys(this.programForm.controls).forEach(key => {
        const control = this.programForm.get(key);
        if (control?.errors) {
          console.log(`${key} errors:`, control.errors);
        }
      });
    }
  }

  
  onCancel(): void {
    this.dialogRef.close();
  }
 


   addTopic(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
  
    if (value) {
      const topicsArray = this.programForm.get('topics') as FormArray;
      if (!topicsArray.value.includes(value)) { // Prevent duplicates
        topicsArray.push(new FormControl(value));
        this.programForm.updateValueAndValidity(); // Force validation update
      }
    }
  
    event.chipInput!.clear();
  }

  removeTopic(topic: string): void {
    const topicsArray = this.programForm.get('topics') as FormArray;
    const index = topicsArray.controls.findIndex(control => control.value === topic);
  
    if (index >= 0) {
      topicsArray.removeAt(index);
      this.programForm.updateValueAndValidity(); // Force validation update
    }
  }


  editTopic(topic: string, event: any): void {
    const value = event.value.trim();
    const index = this.topics.indexOf(topic);

    if (index >= 0) {
      if (value) {
        this.topics[index] = value;
      } else {
        this.topics.splice(index, 1);
      }
      this.programForm.patchValue({
        topics: this.topics
      });
    }
  }

  isTopicsInvalid(): boolean {
    const topicsArray = this.programForm.get('topics') as FormArray;
    return topicsArray.invalid && (topicsArray.dirty || topicsArray.touched);
  }

 
get topicsArray(): FormArray {
  return this.programForm.get('topics') as FormArray;
}

  // Method to set topics array
  setTopics(topics: string[]): void {
    this.topics = [...topics];
  }
 
}
