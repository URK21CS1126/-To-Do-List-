import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  tasks: any[] = [];
  task_name: string = '';

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe(
      (data: any) => {
        this.tasks = data;
      },
      (err) => console.log(err)
    );
  }

  addTask() {
    this.taskService.addTask(this.task_name).subscribe(
      (data) => {
        this.dialog.open(DialogContentExampleDialog, {
          data: { message: 'Task Added Successfully!' },
        });
        this.getTasks(); // Refresh the task list
      },
      (err) => {
        this.dialog.open(DialogContentExampleDialog, {
          data: { message: 'Error: ' + err.error.error },
        });
      }
    );
  }

  updateTask(id: number, task_name: string) {
    this.taskService.updateTask(id, task_name).subscribe(
      (data) => {
        this.dialog.open(DialogContentExampleDialog, {
          data: { message: 'Task Updated Successfully!' },
        });
        this.getTasks();
      },
      (err) => console.log(err)
    );
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(
      (data) => {
        this.dialog.open(DialogContentExampleDialog, {
          data: { message: 'Task Deleted Successfully!' },
        });
        this.getTasks();
      },
      (err) => console.log(err)
    );
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  template: '<h1>{{data.message}}</h1>',
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
