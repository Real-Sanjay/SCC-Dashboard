export interface Trainer {
    _id: string;
    trainerName: string;
    businessUnit: string;
    status: 'Avilable' | 'Not Available';
    expertise: string[],
    module: string[];
    topics: string[];
    noOfHours: number;
  }