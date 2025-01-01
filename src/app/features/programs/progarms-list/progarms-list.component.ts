import { Component, OnInit,ViewChild } from '@angular/core';
import { ProgramService } from 'src/app/core/services/programs.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgramsAddEditComponent } from './programs-add-edit/programs-add-edit.component';
import { Program } from 'src/app/core/interfaces/programs.interface';
import { SnackBarService } from 'src/app/core/services/snackBar.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl } from '@angular/forms';
import { PopUpService } from 'src/app/core/services/pop-up-service';
import { trigger, state, style, transition, animate } from '@angular/animations';



@Component({
  selector: 'app-progarms-list',
  templateUrl: './progarms-list.component.html',
  styleUrls: ['./progarms-list.component.scss']
})
export class ProgarmsListComponent implements OnInit{
 

  programs: Program[] = [];// holds the fetched programs
  groupedPrograms: any[] = [];// holds the grouped programs
  filteredPrograms: any[] = [];// holds filtered data
  searchControl = new FormControl('');// creates form control for search items



 

  constructor( private programService: ProgramService, private dialog:MatDialog, private snackBar: SnackBarService,
    private popUpService: PopUpService
  ) {

  }

  // Lifecycle hook to fetch the programs when the component is initialized
  ngOnInit(): void {
    this.fetchProgramDetails();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.onSearch();
    });
  }


  // Function fetches the programs from the service
  fetchProgramDetails(): void {
    this.programService.getPrograms().subscribe({
      next: (programs: Program[]) => {
        this.groupProgramsByModule(programs); // Group the fetched programs by module
        this.filteredPrograms = [...this.groupedPrograms];
      },
      error: (err) => {
        console.error('Error fetching programs:', err);
      }
    });
  }


  groupProgramsByModule(programs: Program[]): void {
    // Define the accumulator type explicitly
    const grouped: { [key: string]: { module: string; trainers: Program[] } } = programs.reduce(
      (acc, program) => {
        // Check if the module is already in the accumulator
        if (!acc[program.module]) {
          acc[program.module] = {
            module: program.module,
            trainers: [program], // Initialize with the current program as the first trainer
          };
        } else {
          // If the module exists, add the program to the trainers array
          acc[program.module].trainers.push(program);
        }
        return acc;
      },
      {} as { [key: string]: { module: string; trainers: Program[] } } // Initialize the accumulator with the correct type
    );
  
    // Convert the grouped object into an array to bind to the template
    this.groupedPrograms = Object.values(grouped);
    console.log('Grouped programs:', this.groupedPrograms);
  }


  
  onSearch(): void {
    const searchTerm = (this.searchControl.value || '').toLowerCase().trim();
    
    if (!searchTerm) {
      this.filteredPrograms = this.groupedPrograms;
      return;
    }

    // Filter the programs based on search term
    const filteredGroups = this.groupedPrograms.map(group => {
      const filteredTrainers = group.trainers.filter((trainer: { module: string; trainer: string; trainingStatus:string }) =>
        trainer.module.toLowerCase().includes(searchTerm) ||
        trainer.trainer.toLowerCase().includes(searchTerm) 
        
      );

      if (filteredTrainers.length > 0) {
        return {
          ...group,
          trainers: filteredTrainers
        };
      }
      return null;
    }).filter(group => group !== null);

    this.filteredPrograms = filteredGroups;
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
  



 
  // Event handler for delete button
  deleteProgram(id: string): void {
    this.popUpService.confirm('Are you sure you want to delete this program?').subscribe(result=>{
      if(result){
        console.log('Delete program clicked for ID:', id);
        this.programService.deleteProgram(id).subscribe({
          next:(response)=>{
            console.log('Program deleted:', response);
            this.snackBar.openSnackBar('Program deleted', 'Success');
            this.fetchProgramDetails();
          },
          error:(err)=>{
            console.error('Error deleting program:', err);
            this.snackBar.openSnackBar('Error deleting program', 'Error');
        }
      
    });
  }
});
}


  
  editPorgram(id:string, program: Program):void{
    console.log('Edit program clicked for:', program);

    this.programService.updateProgram(id,program).subscribe({
    next:(respons)=>{
      console.log('Program updated:', respons);
      this.snackBar.openSnackBar('Program updated', 'Success'); 
      this.fetchProgramDetails();
    }
    });
    
  }

  openAddEditForm() {
   const dialogRef = this.dialog.open(ProgramsAddEditComponent);
   dialogRef.afterClosed().subscribe({
    next:(res)=>{
      if(res){
        this.fetchProgramDetails();
      }
    }
   })
    
  }

  openEditForm(data:any){
    const dailogRef= this.dialog.open(ProgramsAddEditComponent,{
      data:data
    });
    dailogRef.afterClosed().subscribe({
        next:(res)=>{
          if(res){
            this.fetchProgramDetails();
          }
        }
       });
  }
}

