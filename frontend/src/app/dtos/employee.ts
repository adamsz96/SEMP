import {Account} from "./account";
import {Skill} from "./skill";

export class Employee{
  constructor(
    public id: number,
    public name: string,
    public staffNumber: string,
    public salaryPerHour: number,
    public isManager: boolean,
    public isAdmin: boolean,
    public account: Account,
    public skills: Skill[],
    public role: string) {
  }
}

