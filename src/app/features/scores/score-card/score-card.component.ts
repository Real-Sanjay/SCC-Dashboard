import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ScoresService } from 'src/app/core/services/scores.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewTopicComponent } from '../view-topic/view-topic.component';
import { ViewTraineeReportComponent } from '../view-trainee-report/view-trainee-report.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CreateScoreCardComponent } from '../create-score-card/create-score-card.component';
import { AddColumnComponent } from '../add-column/add-column.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-card',
  standalone: false,
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ScoreCardComponent implements OnInit,AfterViewInit {

  scorecard: any[] = [];
  topics: any[] = [];
  displayedColumns: string[] = ['traineeName', 'overallScore', 'overallPercentage', 'rank'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource: MatTableDataSource<any>;

  // this.dataSource = new MatTableDataSource(this.scorecard);


  //for sorting and pagination
  // @ViewChild(MatPaginator)
  // paginator!: MatPaginator;
  // @ViewChild(MatSort)
  // sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private scorecardservice: ScoresService,private dialog:MatDialog,private router:Router) {
    this.dataSource = new MatTableDataSource(this.scorecard);
    this.paginator = {} as MatPaginator;
    this.sort = {} as MatSort;

    const users = Array.from({length: 100});

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.loadScoreCards();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      }, '').toLowerCase();

      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
  }}

  loadScoreCards() {
    this.scorecardservice.getScoreCard().subscribe({
      next: (data) => {
        this.topics = data.map((topic: any) => ({ name: topic.topicName, _id:topic._id}));
        this.scorecard = this.processData(data);
        this.columnsToDisplay = ['traineeName', ...this.topics.flatMap(topic => 
          [topic.name + 'Score', topic.name + 'Percentage']), 'overallScore', 'overallPercentage', 'rank'];
        console.log('Loaded score cards successfully.');
        this.dataSource.data = this.scorecard;
      },
      error: (error) => {
        console.error('There is an error!', error);
      }
    });
  }

  //Flattening data for easy fetching
  processData(data: any[]): any[] {
    const traineeMap: any = {};

    data.forEach(topic => {
      topic.SCCTrainee.forEach((trainee: any) => {
        if (!traineeMap[trainee.traineeName]) {
          traineeMap[trainee.traineeName] = 
          { traineeName: trainee.traineeName, overallScore: 0, overallPercentage: 0, rank: 0 };
        }
        traineeMap[trainee.traineeName]['_id'] = topic._id;
        traineeMap[trainee.traineeName][topic.topicName + 'Score'] = trainee.assessmentScore;
        traineeMap[trainee.traineeName][topic.topicName + 'Percentage'] = trainee.percentage;
        traineeMap[trainee.traineeName].overallScore += trainee.assessmentScore;
        traineeMap[trainee.traineeName].overallPercentage += trainee.percentage;
      });
    });

    const trainees = Object.values(traineeMap);
    trainees.forEach((trainee: any) => {
      trainee.overallPercentage = parseFloat((trainee.overallPercentage / this.topics.length).toFixed(2));
    });

    trainees.sort((a: any, b: any) => b.overallScore - a.overallScore);
    trainees.forEach((trainee: any, index: number) => {
      trainee.rank = index + 1;
    });

    return trainees;
  }

  delete(id:string){
    // alert('deleted');
    // if(alert('Are you sure want to delete this score card?')==){
    this.scorecardservice.deleteScoreCard(id).subscribe(()=>{
      console.log('deleted score-card successfully.');
    });
  // }
    // alert('deleted');
  }

  clickk(id:string ){
    alert("hovered"+id);
  }

  //view topic dialog box
  openDialog(id:string){
    const dialogRef = this.dialog.open(ViewTopicComponent, {
      data: { id: id }
    });

    // this.dialogRef
    dialogRef.afterClosed().subscribe(result=>{
      console.log(`Dialog Result: ${result}`);
    })
  }

  //trainee_report dialog box
  traineeReport(name:string){
    const dialogRef = this.dialog.open(ViewTraineeReportComponent, {
      data: { name:name }
    });

    dialogRef.afterClosed().subscribe(result=>{
      console.log(`Dialog Result: ${result}`);
    });
  }

  //create score card Dialog box
  createScoreCardDialog(){
    const dialogRef = this.dialog.open(CreateScoreCardComponent);
    
    dialogRef.afterClosed().subscribe(result=>{
     if(result){
      this.loadScoreCards();
      // this.router.navigate['/scorec'];
     }
    });

  }

  //AddColumn score card dialog box
  AddScoreCardDialog(){
    const dialogRef = this.dialog.open(AddColumnComponent);
    
    dialogRef.afterClosed().subscribe(result=>{
      console.log(`Dialog Result: ${result}`);
    });
  }

  editDialog(id:string){
  
     const dialogRef = this.dialog.open(CreateScoreCardComponent, {
      data: { id: id }
    });

    // this.dialogRef
    dialogRef.afterClosed().subscribe(result=>{
      console.log(`Dialog Result: ${result}`);
      // if(result){
      //   this.loadScoreCards();
      // }
    })

  }
}


// import { Component,OnInit } from '@angular/core';
// import { ScoreCardServiceService } from 'src/app/models/score-card-service.service';

// @Component({
//   selector: 'app-score-card',
//   standalone:false,
//   templateUrl: './score-card.component.html',
//   styleUrls: ['./score-card.component.scss']
// })
// export class ScoreCardComponent implements OnInit {

//   //temporary variable to store fetched data
//   scorecard: any[]=[];
//   ModuleIdArray:any;

//   constructor(private scorecardservice:ScoreCardServiceService){}

//   //THis is useful for loading data when page is refreshed or reloaded
//   ngOnInit(): void {
//     this.loadScoreCards();
//   }

//   //fetching Score card from database
//   loadScoreCards(){
//     this.scorecardservice.getScoreCard().subscribe({
//       next:(data)=>{
//         this.scorecard=data;
//         console.log('loaded score cards succesfully.')
//       },
//       error:(error)=>{
//         console.error('There is an error!',error);
//       }
//     });
//     // Iterate over the outer array
//     this.scorecard.forEach(topic => {
//       // console.log(`Topic: ${topic.topicName}, Total Marks: ${topic.totalMarks}`);
//       this.ModuleIdArray=topic.SCCTrainee;


//       // Iterate over the inner array
//       topic.SCCTrainee.forEach((trainee:any) => {
//         // console.log(`Name: ${trainee.traineeName}, Score: ${trainee.assessmentScore}`);
//         data:this.scorecard;
//       });
//     });
//   }

//   displayedColumns: string[]= ['traineeName','assessmentScore','percentage'];
//   columnsToDisplay: string[] = this.displayedColumns.slice();

//   //displaying design using Angular material UI
//   // displayedColumns: string[] = ['topicName'];
//   // columnsToDisplay: string[] = this.displayedColumns.slice();
//   // data:any[]=this.scorecard;

// }
