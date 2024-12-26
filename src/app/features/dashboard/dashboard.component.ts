import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  PieChart: any;
  BarChart: any;

  constructor() { }

  summaryCards = [
    {
      title: 'Trainees',
      icon: 'people',
      metrics: [
        { label: 'Total Trainees', value: '120' },
      ],
    },
    {
      title: 'Trainers',
      icon: 'person',
      metrics: [
        { label: 'Total Trainers', value: '20' },
      ],
    },
    {
      title: 'Programs',
      icon: 'school',
      metrics: [
        { label: 'Total Programs', value: '15' },
        { label: 'Ongoing Programs', value: '5' },
        { label: 'Upcoming Programs', value: '3' },
      ],
    },
    {
      title: 'Scores',
      icon: 'bar_chart',
      metrics: [
        { label: 'Average Score', value: '75%' },
        { label: 'Highest Score', value: '95%' },
        { label: 'Lowest Score', value: '50%' },
      ],
    },
  ];


  //-----------------Training Schedule-------------------
  public PieChartConfig: any = {
    type: 'pie',
    data: {
      labels: [
        'Scheduled', 'Ongoing', 'Completed'
      ],
      datasets: [{
        label: 'Trainings',
        data: [15, 10, 5],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    },
  };


  //-----------------Assesment Scores-------------------
  public BarChartConfig: any = {
    type: 'bar',
    data: {
      labels: ['Program 1', 'Program 2', 'Program 3', 'Program 4', 'Program 5', 'Program 6', 'Program 7'],
      datasets: [{
        label: 'Total Marks',
        data: [80, 90, 80, 70, 85, 75, 90],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',

        ],
        borderColor: [
          'rgb(255, 99, 132)',

        ],
        borderWidth: 1
      },
      {
        label: 'Average Scores',
        data: [70, 80, 75, 65, 80, 70, 85],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgb(54, 162, 235)',
        ],
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


  ngOnInit(): void {
    this.PieChart = new Chart('MyPieChart', this.PieChartConfig);
    this.BarChart = new Chart('MyBarChart', this.BarChartConfig);
  }

}




