import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrainersAddEditComponent } from './trainers-add-edit/trainers-add-edit.component';
import { Trainer } from 'src/app/core/interfaces/trainers.interface';
import { SnackBarService } from 'src/app/core/services/snackBar.service';
import { TrainerService } from 'src/app/core/services/trainers.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';



@Component({
  selector: 'app-trainers-list',
  templateUrl: './trainers-list.component.html',
  styleUrls: ['./trainers-list.component.scss']
})  
export class TrainersListComponent implements OnInit {
  trainers: Trainer[] = [];

  filteredTrainers: Trainer[] = [];
  searchControl = new FormControl('');

  constructor(private trainerService: TrainerService, private dialog: MatDialog, private snackBar: SnackBarService) {}

  ngOnInit(): void {
    this.getTrainers();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.onSearch();
    });
  }


//ol search 
// getTrainers(): void{
// this.trainerService.getAllTrainers().subscribe({
//   next: (res) =>{
//     this.trainers = res;
//     console.log(this.trainers);
//   },
//   error: (err) =>{
//     console.log("Error occured while getting data", err);
//   }
// });

// }

getTrainers(): void {
  this.trainerService.getAllTrainers().subscribe({
    next: (res) => {
      this.trainers = res;
      this.filteredTrainers = [...this.trainers]; // Initialize filtered trainers
      console.log(this.trainers);
    },
    error: (err) => {
      console.log("Error occurred while getting data", err);
    }
  });
}


 onSearch(): void {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    
    if (!searchTerm) {
      this.filteredTrainers = [...this.trainers];
      return;
    }

    this.filteredTrainers = this.trainers.filter(trainer => 
      trainer.trainerName.toLowerCase().includes(searchTerm) ||
      trainer.businessUnit.toLowerCase().includes(searchTerm) ||
      trainer.expertise.some(exp => exp.toLowerCase().includes(searchTerm)) ||
      trainer.module.some(module => module.toLowerCase().includes(searchTerm)) ||
      trainer.topics.some(topic => topic.toLowerCase().includes(searchTerm))
    );
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }




    openAddEditForm() {
     const dialogRef = this.dialog.open(TrainersAddEditComponent);
     dialogRef.afterClosed().subscribe({
      next:(res)=>{
        if(res){
          this.getTrainers();
        }
      }
     })
      
    }

    openEditForm(data:any){
        const dailogRef= this.dialog.open(TrainersAddEditComponent,{
          data:data
        });
        dailogRef.afterClosed().subscribe({
            next:(res)=>{
              if(res){
                this.getTrainers();
              }
            }
           });
      }

  deleteProgram(id: string): void {
    // Logic to delete a program
    this.trainerService.deleteTrainer(id).subscribe({
      next:(res)=>{
        console.log("Trainer deleted successfully!");
        this.snackBar.openSnackBar("Trainer deleted", 'Success');
        this.getTrainers();
      },
      error(err) {
          console.log(err);
      },
    });
  }

}
