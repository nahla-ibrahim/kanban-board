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
import { ListData, Result, TaskData, Title } from '../../models/board.model';
import { SingleTask } from '../single-task/single-task';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faPlus, faTrash, faClose } from '@fortawesome/free-solid-svg-icons';
import { form, required, Field, submit } from '@angular/forms/signals';
import { ClickOutsideDirective } from '../../directives/click-outside';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ConfirmBtn } from '../confirm-btn/confirm-btn';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoardStore } from '../../services/board-store';

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
  showTaskTitleInput = signal<boolean>(false);
  newTask = signal<Title>({
    title: '',
  });
  newTaskForm = form(this.newTask, (schema) => {
    required(schema.title, { message: 'The title of task is required' });
  });
  private readonly store = inject(BoardStore);
  private readonly snackBar = inject(MatSnackBar);

  addNewTask = (e: Event) => {
    e.preventDefault();

    submit(this.newTaskForm, async () => {
      const result = this.store.addTask(this.listData().id, this.newTask().title);

      this.notify(result, 'Task added successfully');

      // Keep what the user typed on screen when the title was rejected.
      if (result.ok) {
        this.setTaskTitleInput(false);
        this.newTaskForm().value.set({ title: '' });
      }
    });
  };

  deleteTask(taskId: string) {
    this.store.deleteTask(this.listData().id, taskId);
    this.snackBar.open('Task deleted successfully', 'Close', {
      duration: 3000,
    });
  }

  setTaskTitleInput(value: boolean) {
    this.showTaskTitleInput.set(value);
  }

  updateTask = (updatedTask: TaskData) => {
    this.notify(this.store.updateTask(this.listData().id, updatedTask), 'Task updated successfully');
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
    const result = this.store.renameList(this.listData().id, this.title());

    if (!result.ok) {
      this.snackBar.open(result.error, 'Close', { duration: 3000 });
      return;
    }

    this.editingTitle.set(false);
  }

  cancelEdit() {
    this.editingTitle.set(false);
  }

  ///////////////////delete list //////////////////
  deleteColumn() {
    this.store.deleteList(this.listData().id);
    this.snackBar.open('Column deleted successfully', 'Close', {
      duration: 3000,
    });
  }

  private notify(result: Result, successMessage: string) {
    this.snackBar.open(result.ok ? successMessage : result.error, 'Close', {
      duration: 3000,
    });
  }
}
