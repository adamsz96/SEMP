import {Component, Input, OnInit} from '@angular/core';
import {Skill} from "../../../dtos/skill";
import {SkillService} from "../../../services/skill.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Globals} from "../../../global/globals";

@Component({
  selector: 'app-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss']
})
export class SkillDetailComponent implements OnInit {

  @Input()
  newSkill:Skill;
  constructor(private skillService: SkillService,
              private route: ActivatedRoute,
              private location: Location,
              public globals: Globals,
              private router: Router) { }

  ngOnInit() {
    this.newSkill = new Skill(null, "");
  }

  public addSkill():void{
    if(this.newSkill == null || this.newSkill.name == null || this.newSkill.name.trim() === "") {
      console.log("skill was null or ")
    }else{
      console.log("call addSkill")
      this.skillService.addSkill(this.newSkill).subscribe(_ => {
        this.router.navigate(["/skills"]);
      });
      console.log("call addSkill Ende")
    }

  }

}
