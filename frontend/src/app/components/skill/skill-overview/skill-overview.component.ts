import { Component, OnInit } from '@angular/core';
import {SkillService} from "../../../services/skill.service";
import {Skill} from "../../../dtos/skill";

@Component({
  selector: 'app-skill-overview',
  templateUrl: './skill-overview.component.html',
  styleUrls: ['./skill-overview.component.scss']
})
export class SkillOverviewComponent implements OnInit {

  private searchWord: string;
  private allSkills: Skill[];
  private filteredSkills: Skill[]

  constructor(private skillService: SkillService) {
    this.skillService.getSkills().subscribe(
      skills => {
        this.allSkills = skills;
        this.filteredSkills = skills;
      }

    );
  }


  ngOnInit() {

  }


  clear(){
    this.searchWord = '';
    this.filteredSkills = this.allSkills;
  }

  filter() {
    let searchWord = this.searchWord.trim().toLowerCase();

    this.filteredSkills = this.allSkills.filter((skill) => {
      if ((skill.id + '').toLowerCase().includes(searchWord) || (skill.name + '').toLowerCase().includes(searchWord)){
        return true;
      } else {
        return false;
      }
    });
  }
}
