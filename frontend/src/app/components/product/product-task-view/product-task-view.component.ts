import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {SimpleTask} from '../../../dtos/simpletask';
import {SkillService} from "../../../services/skill.service";
import {Skill} from "../../../dtos/skill";
import {Product} from "../../../dtos/product";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-product-task-view',
  templateUrl: './product-task-view.component.html',
  styleUrls: ['./product-task-view.component.scss']
})
export class ProductTaskViewComponent implements OnInit {

  @Input()
  public product: Product;
  public tasks: SimpleTask[] = [];
  @Input()
  public editMode: boolean;

  public newTask: SimpleTask;

  public skills: Skill[];

  private toDelete;

  constructor(private productService: ProductService,
              private skillService: SkillService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.getSkills();
    let tasks: Map<number, SimpleTask> = new Map<number, SimpleTask>();

    for (let task of this.product.tasks) {
      let newTask = new SimpleTask(task.id, task.name, task.allocatedTime, task.skill.name, []);
      tasks.set(task.id, newTask);
    }

    for (let task of this.product.tasks) {
      for (let parent of task.parentTasks) {
        tasks.get(task.id).parentTasks = tasks.get(task.id).parentTasks.concat(tasks.get(parent.id));
      }
      this.tasks = this.tasks.concat(tasks.get(task.id));
    }

    this.newTask = null;
  }

  private getSkills() {
    this.skillService.getAllSkills().subscribe((skills: Skill[]) => {
      this.skills = skills;
    });
  }

  getPossibleTasks(task: SimpleTask): SimpleTask[] {
    let tasks = this.tasks.filter(t => t.id != task.id);
    let predecessorIds = task.parentTasks.map(v => v.id);
    tasks = tasks.filter(t => !predecessorIds.includes(t.id));
    return tasks;
  }

  private static isCycleFree(task: SimpleTask): boolean {
    let closed: number[] = [];
    let opened: SimpleTask[] = [task];
    while (opened.length > 0) {
      let t = opened.pop();
      closed = closed.concat(t.id);
      if (t.parentTasks) {
        for (let predecessor of t.parentTasks) {
          if (predecessor.id == task.id) return false;
          opened = opened.concat(predecessor);
        }
      }
    }
    return true;
  }

  private updateTask(task: SimpleTask) {
    if (!this.isValid(task)) return;
    this.productService.updateSimpleTaskForProduct(task, this.product).subscribe((updatedSimpleTask: SimpleTask) => {
      task = updatedSimpleTask;
    }, error => {
      let message = "Error while updating task";
      this.toastr.error(message);
      console.log(message+":");
      console.log(error)
    });
  }

  addPredecessorToTask(task: SimpleTask, event: any) {
    if (event.target.selectedOptions[0].id != "") {
      let selectedId: number = event.target.selectedOptions[0].id;
      let newPredecessor: SimpleTask = this.tasks.find(t => t.id == selectedId);
      task.parentTasks = task.parentTasks.concat(newPredecessor);

      if (!ProductTaskViewComponent.isCycleFree(task)) {
        this.toastr.error("The new predecessor would create a cycle. The change was reverted.");
        task.parentTasks = task.parentTasks.filter(f => f != newPredecessor);
        event.target.selectedIndex = 0;
      } else {
        if (task.id) {
          this.updateTask(task);
        }
      }
    }
  }

  removePredecessor(task: SimpleTask, predecessor: SimpleTask) {
    task.parentTasks = task.parentTasks.filter(v => v.id != predecessor.id);
    this.updateTask(task);
  }

  showTaskDialog() {
    $("#task_delete_dialog").show();
  }

  deleteTaskDialog() {
    this.newTask = null;
    this.closeTaskDialog();
  }

  closeTaskDialog() {
    $("#task_delete_dialog").hide();
  }

  showPredecessorDialog(task: SimpleTask, parent: SimpleTask) {
    this.toDelete = {task: task, parent: parent};
    $("#predecessor_delete_dialog").show();
  }

  deletePredecessorDialog() {
    this.removePredecessor(this.toDelete.task, this.toDelete.parent);
    this.closePredecessorDialog();
  }

  closePredecessorDialog() {
    $("#predecessor_delete_dialog").hide();
  }

  showNewTask() {
    this.newTask = new SimpleTask(null, "", 1,"", []);
  }

  private isValid(task: SimpleTask): boolean {
    if (task.allocatedTime < 1 || task.allocatedTime > 9*4) {
      this.toastr.error("Allocated time of a task has to be between 0.25 hours (inclusive) and 9 hours (inclusive)");
      return false;
    }

    if (task.skill == undefined || task.skill.length == 0) {
      this.toastr.error("Required skill of a task has to be set");
      return false;
    }

    if (task.name == undefined || task.name.length == 0) {
      this.toastr.error("Name of task has to be set");
      return false;
    }

    return true;
  }

  addNewTask() {
    if (this.isValid(this.newTask)) {
      this.productService.addSimpleTaskForProduct(this.newTask, this.product).subscribe((newTask: SimpleTask) => {
        this.tasks = this.tasks.concat(newTask);
        this.newTask = null;
      }, error => {
        let message = "Error while adding new task";
        this.toastr.error(message);
        console.log(message+":");
        console.log(error)
      });
    }
  }

  setAllocatedTime(task: SimpleTask, time: number) {
    task.allocatedTime = Math.round(time*4);
    if (!this.newTask) {
      if (this.isValid(task)) {
        this.productService.updateSimpleTaskForProduct(task, this.product).subscribe((updatedSimpleTask: SimpleTask) => {
          task = updatedSimpleTask;
        }, error => {
          let message = "Error while setting new time for task";
          this.toastr.error(message);
          console.log(message+":");
          console.log(error)
        });
      }
    }
  }
}
