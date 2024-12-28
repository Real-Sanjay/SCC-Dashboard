import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ScoresService } from 'src/app/core/services/scores.service';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ViewTopicComponent } from '../view-topic/view-topic.component';
import { ViewTraineeReportComponent } from '../view-trainee-report/view-trainee-report.component';
import { CreateScoreCardComponent } from '../create-score-card/create-score-card.component';
import { AddColumnComponent } from '../add-column/add-column.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-card',
  standalone: false,
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss'],
})
export class ScoreCardComponent implements OnInit,AfterViewInit {

  scorecard: any[] = [];
  topics: any[] = [];
  displayedColumns: string[] = ['traineeName', 'overallScore', 'overallPercentage', 'rank'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource: MatTableDataSource<any>;

  //for sorting and pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private scorecardservice: ScoresService,private dialog:MatDialog,private router:Router) {

    this.dataSource = new MatTableDataSource(this.scorecard);
    this.paginator = {} as MatPaginator;
    this.sort = {} as MatSort;

  }

  // life-cycle hook
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //filter with Trainee Name
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // life-cycle hook
  ngOnInit(): void {
    this.loadScoreCards();

    //DataSource filtering
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      }, '').toLowerCase();

      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
  }
}

//loading score cards
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
        console.log(error.url);
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
          { traineeName: trainee.traineeName, overallScore: 0, overallPercentage: 0, rank: 0, totalscore:0};
        }
        traineeMap[trainee.traineeName].totalscore+=topic.totalMarks;
        traineeMap[trainee.traineeName]['_id'] = topic._id;
        traineeMap[trainee.traineeName][topic.topicName + 'Score'] = trainee.assessmentScore;
        traineeMap[trainee.traineeName][topic.topicName + 'Percentage'] = trainee.percentage.toFixed(2);
        traineeMap[trainee.traineeName].overallScore += trainee.assessmentScore;
        traineeMap[trainee.traineeName].overallPercentage = trainee.percentage;
      });
    });

    //calculating overall percentage
    const trainees = Object.values(traineeMap);
    trainees.forEach((trainee: any) => {
      trainee.overallPercentage = parseFloat(((trainee.overallScore/ trainee.totalscore)*100).toFixed(2));
    });
    //calculating Rank
    trainees.sort((a: any, b: any) => b.overallScore - a.overallScore);
    trainees.forEach((trainee: any, index: number) => {
      trainee.rank = index + 1;
    });

    return trainees;

  }

//deleting topic from Databasee
  delete(id:string){
    this.scorecardservice.deleteScoreCard(id).subscribe({
      next:(res)=>{
        console.log('deleted score-card successfully.');
         this.helper();  
      },
      error:(error)=>{
        console.log(error.url);

      } 
    });
  }

//helper function for delete
  helper(){
    this.loadScoreCards();
  }

   //view topic dialog box
   openDialog(id:string){
    const dialogRef = this.dialog.open(ViewTopicComponent, {
      data: { id: id }
    });
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
     }
    });
  }

  //AddColumn score card dialog box
  AddScoreCardDialog(){
    const dialogRef = this.dialog.open(AddColumnComponent);
    dialogRef.afterClosed().subscribe(result=>{
      console.log(`Dialog Result: ${result}`);
      if(result){
        this.loadScoreCards();
      }
    });
  }

  editDialog(id:any){
  
     const dialogRef = this.dialog.open(CreateScoreCardComponent, {
      data: { id: id }
    });

    // this.dialogRef
    dialogRef.afterClosed().subscribe(result=>{
      console.log(`Dialog Result: ${result}`);
      if(result){
        this.loadScoreCards();
      }
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
