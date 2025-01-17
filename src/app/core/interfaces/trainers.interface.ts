export interface Trainer {
  _id: string;
  trainerName: string;
  businessUnit: string;
  status: 'Available' | 'Not Available';
  expertise: string[],
  module: string[];
  topics: string[];
  noOfHours: number;
}
