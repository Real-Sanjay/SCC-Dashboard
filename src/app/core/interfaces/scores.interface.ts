export interface Trainee {
    traineeName: string;
    assessmentScore: number;
    percentage: number;
  }
  
  export interface ScoreCard {
    topicName: string;
    totalMarks: number;
    SCCTrainee: Trainee[];
  }
  