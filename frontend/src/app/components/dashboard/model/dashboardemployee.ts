import {PlannedTask} from './plannedtask';
import { TimeSlot } from './timeslot';
import { Skill } from 'src/app/dtos/skill';

export class DashboardEmployee {

  employeeId: number;
  name: string;
  longestBreak: number;
  longestBreakStartDate: Date;
  tasks: PlannedTask[];
  timeSlotList: TimeSlot[];
  skills: Skill[];

  constructor(employeeId?: number, name?: string) {
    if (employeeId) {
      this.employeeId = employeeId;
    }
    if (name) {
      this.name = name;
    }
    this.tasks = <PlannedTask[]>[];
    this.longestBreak = 0;
    this.longestBreakStartDate = null;
    this.timeSlotList = <TimeSlot[]>[];
    this.skills = <Skill[]>[];
  }
}
