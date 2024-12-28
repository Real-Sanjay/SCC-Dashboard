import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TrainerService } from 'src/app/core/services/trainers.service';
import { ProgramService } from 'src/app/core/services/programs.service';
import { ScoresService } from 'src/app/core/services/scores.service';
import { TraineeService } from 'src/app/core/services/trainees.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  PieChart: any;
  BarChart: any;
  totalTrainers: string = '0'; 
  totalPrograms: string = '0';
  ongoingPrograms: string = '0';
  completedPrograms: string = '0';
  scheduledPrograms: string = '0';
  averageScore: string = '0';
  highestScore: string = '0';
  lowestScore: string = '0';
  totalTrainees: string = '0';

  constructor(private trainerService: TrainerService, private programService: ProgramService, private scoresService: ScoresService, private traineeService: TraineeService) {
    console.log('DashboardComponent initialized');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.getProgramDetails();
    this.getScoreDetails();
    this.initializeCharts();
    this.getTotalTrainees();
    this.getTotalTrainers();
  }

  // Method to initialize charts
  private initializeCharts(): void {
    this.PieChart = new Chart('MyPieChart', this.PieChartConfig);
    this.BarChart = new Chart('MyBarChart', this.BarChartConfig);
  }

  // Method to fetch total trainers
  private getTotalTrainers(): void {
    this.trainerService.getAllTrainers().subscribe((trainers) => {
      this.totalTrainers = trainers.length.toString();
      this.summaryCards[1].metrics[0].value = this.totalTrainers;
    });
  }

  // Method to fetch program details and filtering data to update summary card and pie chart
  private getProgramDetails(): void {
    this.programService.getPrograms().subscribe((programs) => {
      const scheduled = programs.filter((p) => p.status === 'Scheduled').length;
      const ongoing = programs.filter((p) => p.status === 'Ongoing').length;
      const completed = programs.filter((p) => p.status === 'Completed').length;

      this.totalPrograms = programs.length.toString();
      this.scheduledPrograms = scheduled.toString();
      this.ongoingPrograms = ongoing.toString();
      this.completedPrograms = completed.toString();

      // Updating Summary Card
      this.summaryCards[2].metrics[0].value = this.totalPrograms;
      this.summaryCards[2].metrics[1].value = this.completedPrograms;
      this.summaryCards[2].metrics[2].value = this.ongoingPrograms;
      this.summaryCards[2].metrics[3].value = this.scheduledPrograms;

      // Updating Pie Chart Data
      this.PieChartConfig.data.datasets[0].data = [this.totalPrograms,scheduled, ongoing, completed];
      this.PieChart.update();
    });
  }

  // Method to fetch score details and filtering data to update summary card and bar chart
  private getScoreDetails(): void {
    this.scoresService.getScoreCard().subscribe((scores) => {
      // Extracting program names, total marks, and average scores
      const programNames = scores.map((score: any) => score.topicName);
      const totalMarks = scores.map((score: any) => score.totalMarks);

      // Calculating average score per program
      const averageScores = scores.map((score: any) => {
        const totalScore = score.SCCTrainee.reduce((sum: number, trainee: any) => sum + trainee.assessmentScore, 0);
        return score.SCCTrainee.length > 0 ? totalScore / score.SCCTrainee.length : 0;
      });

      // Updating Summary Card with overall score statistics
      const averageOfAllScores = (averageScores.reduce((a: number, b: number) => a + b, 0) / averageScores.length).toFixed(2);
      const highestScore = Math.max(...averageScores).toFixed(2);
      const lowestScore = Math.min(...averageScores).toFixed(2);

      this.averageScore = `${averageOfAllScores}%`;
      this.highestScore = `${highestScore}%`;
      this.lowestScore = `${lowestScore}%`;

      this.summaryCards[3].metrics[0].value = this.averageScore;
      this.summaryCards[3].metrics[1].value = this.highestScore;
      this.summaryCards[3].metrics[2].value = this.lowestScore;

      // Updating Bar Chart Data
      this.BarChartConfig.data.labels = programNames;
      this.BarChartConfig.data.datasets[0].data = totalMarks;
      this.BarChartConfig.data.datasets[1].data = averageScores;

      this.BarChart.update();
    });
  }

  // Method to fetch total trainees
  private getTotalTrainees(): void {
    this.traineeService.getAllTrainees().subscribe((trainees) => {
      this.totalTrainees = trainees.length.toString();  
      this.summaryCards[0].metrics[0].value = this.totalTrainees;
    });
  }

  //---------------- Summary Cards -------------------
  summaryCards = [
    {
      title: 'Trainees',
      icon: 'people',
      metrics: [
        { label: 'Total Trainees', value: this.totalTrainees },
      ],
    },
    {
      title: 'Trainers',
      icon: 'person',
      metrics: [
        { label: 'Total Trainers', value: this.totalTrainers },
      ],
    },
    {
      title: 'Programs',
      icon: 'school',
      metrics: [
        { label: 'Total Programs', value: this.totalPrograms },
        { label: 'Completed Programs', value: this.completedPrograms },
        { label: 'Ongoing Programs', value: this.ongoingPrograms },
        { label: 'Scheduled Programs', value: this.scheduledPrograms },
      ],
    },
    {
      title: 'Scores',
      icon: 'bar_chart',
      metrics: [
        { label: 'Average Score', value: this.averageScore },
        { label: 'Highest Score', value: this.highestScore },
        { label: 'Lowest Score', value: this.lowestScore },
      ],
    },
  ];

  //-----------------Training Schedule-------------------
  public PieChartConfig: any = {
    type: 'pie',
    data: {
      labels: ['Total','Scheduled', 'Ongoing', 'Completed'],
      datasets: [{
        label: 'Trainings',
        data: [10, 5, 2, 3],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(92, 255, 86)',
        ],
        hoverOffset: 4
      }]
    },
  };

  //-----------------Assessment Scores-------------------
  public BarChartConfig: any = {
    type: 'bar',
    data: {
      labels: ['Program 1', 'Program 2', 'Program 3', 'Program 4'],
      datasets: [
        {
          label: 'Total Marks',
          data: [10, 20, 30, 40],
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgb(255, 99, 132)'],
          borderWidth: 1
        },
        {
          label: 'Average Scores',
          data: [5, 10, 15, 20],
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgb(54, 162, 235)'],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

}


