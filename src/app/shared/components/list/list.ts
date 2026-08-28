import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { ListData, TaskData, Title } from '../../../pages/board/board';
import { SingleTask } from '../single-task/single-task';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faPlus, faTrash, faClose } from '@fortawesome/free-solid-svg-icons';
import { form, required, Field, submit } from '@angular/forms/signals';
import { ClickOutsideDirective } from '../../directives/click-outside';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ConfirmBtn } from '../confirm-btn/confirm-btn';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  imports: [
    SingleTask,
    FontAwesomeModule,
    Field,
    ClickOutsideDirective,
    CdkDropList,
    CdkDrag,
    ConfirmBtn,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  @ViewChild('titleInput') titleInput?: ElementRef<HTMLInputElement>;
  constructor() {
    effect(() => {
      if (this.showTaskTitleInput()) {
        queueMicrotask(() => this.titleInput?.nativeElement?.focus());
      }
    });
  }

  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  faclose = faClose;
  listData = input.required<ListData>();
  connectedList = input.required<string[]>();
  dropTask = output<CdkDragDrop<TaskData[]>>();
  updateListData = output<ListData>();
  showTaskTitleInput = signal<boolean>(false);
  newTask = signal<Title>({
    title: '',
  });
  newTaskForm = form(this.newTask, (schema) => {
    required(schema.title, { message: 'The title of task is required' });
  });
  private snackBar = inject(MatSnackBar);

  addNewTask = (e: Event) => {
    e.preventDefault();

    submit(this.newTaskForm, async () => {
      const title = this.newTask().title.trim();

      if (!title) {
        this.snackBar.open('Task Title Needed', 'Close', {
          duration: 3000,
        });
        return;
      }

      const currentTasks = this.listData().tasks ?? [];
      const exists = currentTasks.some((task) => task.title.toLowerCase() === title.toLowerCase());

      if (exists) {
        this.snackBar.open('Task name already exists', 'Close', {
          duration: 3000,
        });

        return;
      }
      this.updateListData.emit({
        ...this.listData(),
        tasks: [
          ...currentTasks,
          {
            id: crypto.randomUUID(),
            title: this.newTask().title,
            description: '',
            priority: null,
            tags: [],
            order: currentTasks.length + 1,
          },
        ],
      });
      this.setTaskTitleInput(false);
      this.newTaskForm().value.set({ title: '' });
      this.snackBar.open('Task added successfully', 'Close', {
        duration: 3000,
      });
    });
  };

  deleteTask(taskId: string) {
    const tasks = this.listData().tasks;
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      tasks.splice(taskIndex, 1);
      this.updateListData.emit({
        ...this.listData(),
        tasks: tasks,
      });
    }
  }

  setTaskTitleInput(value: boolean) {
    this.showTaskTitleInput.set(value);
  }

  updateTask = (updatedTask: TaskData) => {
    const tasks = this.listData().tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );

    this.updateListData.emit({
      ...this.listData(),
      tasks,
    });
    this.snackBar.open('Task updated successfully', 'Close', {
      duration: 3000,
    });
  };
  //////////////// edit list title input //////////////////

  editingTitle = signal(false);
  title = signal('');

  startEdit() {
    this.title.set(this.listData().title);
    this.editingTitle.set(true);
  }

  onTitleChange(event: Event) {
    this.title.set((event.target as HTMLInputElement).value);
  }

  saveEdit() {
    const title = this.title().trim();

    if (!title) {
      return;
    }

    this.updateListData.emit({
      ...this.listData(),
      title,
    });

    this.editingTitle.set(false);
  }

  cancelEdit() {
    this.editingTitle.set(false);
  }

  ///////////////////delete list //////////////////
  deleteList = output<string>();
  deleteColumn() {
    this.deleteList.emit(this.listData().id);
  }
}
