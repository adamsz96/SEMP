import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Globals} from "../global/globals";
import {Observable} from "rxjs";
import {Skill} from "../dtos/skill";
import {Employee} from "../dtos/employee";
import {Product} from "../dtos/product";

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private skillBaseUrl: string = this.globals.backendUri + '/skill';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient,
              private globals: Globals) { }

  getAllSkills(): Observable<Skill[]> {
    console.log("Get all skills");
    return this.httpClient.get<Skill[]>(this.skillBaseUrl);
  }

  public getSkills(): Observable<Skill[]>{
    console.log("load all skills");
    return this.httpClient.get<Skill[]>(this.skillBaseUrl);
  }

  public addSkill(skill: Skill): Observable<Skill>{
    console.log("Create new skill with name: " + skill.name);
    return this.httpClient.post<Skill>(this.skillBaseUrl, skill);
  }

  public getSkill(id: number): Observable<Skill> {
    return this.httpClient.get<Skill>(this.skillBaseUrl + '/' + id);
  }

}
