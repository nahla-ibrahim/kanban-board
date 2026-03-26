import { Component, effect, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { ListData, TaskData, Title } from '../../../pages/board/board';
import { SingleTask } from "../single-task/single-task";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { form, required, Field, submit } from '@angular/forms/signals';
import { ClickOutsideDirective } from "../../directives/click-outside";
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list',
  imports: [SingleTask, FontAwesomeModule, Field, ClickOutsideDirective, CdkDropList, CdkDrag],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  @ViewChild('titleInput') titleInput?: ElementRef<HTMLInputElement>;

  faPlus = faPlus
  listData = input.required<ListData>();
  connectedList = input.required<string[]>();
  dropTask = output<CdkDragDrop<TaskData[]>>();
  updateListData = output<ListData>();
  showTaskTitleInput = signal<boolean>(false);
  newTask = signal<Title>({
    title: ''
  })
  newTaskForm = form(this.newTask, (schema) => {
    required(schema.title, {message: 'The title of task is required'})
  });

  addNewTask = (e: Event) => {
    e.preventDefault();

    submit(this.newTaskForm, async() => {
      const currentTasks = this.listData().tasks ?? [];
      this.updateListData.emit({
        ...this.listData(),
        tasks: [
          ...currentTasks,
          {
            id:crypto.randomUUID(),
            title: this.newTask().title,
            description: '',
            periorty: null,
            tags: [],
            order: currentTasks.length+1,
          }
        ]
     } );
      this.setTaskTitleInput(false)
      this.newTaskForm().value.set({title: ''})
    })
  }

  deleteTask = (taskId: string) => {
    const tasks = this.listData().tasks;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if(taskIndex >= 0) {
      tasks.splice(taskIndex, 1);
      this.updateListData.emit({
        ...this.listData(),
        tasks: tasks
      })
    }
  }

  setTaskTitleInput = (value: boolean) => {
    this.showTaskTitleInput.set(value)
  }

   constructor() {
    effect(() => {
      if (this.showTaskTitleInput()) {
        queueMicrotask(() => this.titleInput?.nativeElement?.focus());
      }
    });
  }
}
