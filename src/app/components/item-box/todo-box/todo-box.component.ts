import { Component, OnInit, Input } from '@angular/core';
import { TaskModel } from '../../../models/TaskModel';
import { HttpService } from '../../../services/http-service/http-service.service';

@Component({
  selector: 'app-todo-box',
  templateUrl: './todo-box.component.html',
  styleUrls: ['./todo-box.component.scss']
})
export class TodoBoxComponent implements OnInit {

  //#region Public Members
  @Input() tasks: any[] = [];
  public mod: TaskModel = new TaskModel();
  public localTask: string[] =[];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService) { }

  public ngOnInit(): void {
    console.log(this.tasks)
    this.tasks.forEach(t =>{ this.localTask.push(t.message)})
  }
  //#endregion

  //#region Public Methods
  /**
   * Add new Task
   */
  public AddTask():void{
    this.mod.email = localStorage.getItem("email");
    this.localTask.push(this.mod.message);
    this.httpservice.httpPost('todo/insertTask', this.mod).subscribe(
      res => { console.log(res)},
      err => { console.log(err)}
    )  
  }
  //#endregion

}
