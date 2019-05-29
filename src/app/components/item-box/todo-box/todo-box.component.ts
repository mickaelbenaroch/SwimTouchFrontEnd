import { TaskModel } from '../../../models/TaskModel';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpService } from '../../../services/http-service/http-service.service';

@Component({
  selector: 'app-todo-box',
  templateUrl: './todo-box.component.html',
  styleUrls: ['./todo-box.component.scss']
})
export class TodoBoxComponent implements OnInit, OnChanges{

  //#region Public Members
  @Input() misssions: any;
  public mod: TaskModel = new TaskModel();
  public localTask: string[] =[];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService) { }

  public ngOnInit(): void {
    console.log(this.misssions)
    this.misssions.forEach(t =>{ 
      if(!this.localTask.includes(t.message)){
          this.localTask.push(t.message)
      }
    })
  }

  public ngOnChanges():void{
    console.log(this.misssions)
    this.misssions.forEach(t =>{ 
      if(!this.localTask.includes(t.message)){
        this.localTask.push(t.message)
    }
    })
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

  /**
   * Delete Task
   */
  public DeleteTask(task: string):void{
    this.misssions.forEach(mission => {
      if(mission.message == task){
        var taskToDelete = mission;
        var index = this.localTask.indexOf(task);
        this.httpservice.httpPost('todo/deleteTask', { email: localStorage.getItem("email"), task_id: taskToDelete.id}).subscribe(
          res =>{ 
            console.log(res);
            this.localTask.splice(index,1);
          },
          err =>{
            console.log(err);
          }
        )
      }
    });    
  }
  //#endregion

}
