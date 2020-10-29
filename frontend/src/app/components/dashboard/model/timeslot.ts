export class TimeSlot{
    type: string;               // 'task', 'freetime'
    startTime: Date;
    endTime: Date;
    duration: number;

    constructor(type: string, startTime: Date, endTime: Date, duration: number) {
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
    }
}