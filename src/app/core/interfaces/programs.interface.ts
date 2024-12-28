import { Trainer } from "./trainers.interface";

export interface Program{
    _id?: string;
    module: string;
    topics: string[];
    dayHour: number;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    trainingMode: 'Online' | 'Offline';
    trainer:string; 
    status: 'Scheduled' | 'Ongoing' | 'Completed';
    
}
   