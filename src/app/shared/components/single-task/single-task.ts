import { Component, input, output, signal } from '@angular/core';
import { TaskData } from '../../../pages/board/board';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ConfirmBtn } from '../confirm-btn/confirm-btn';
import { EditModal } from '../edit-modal/edit-modal';

@Component({
  selector: 'app-single-task',
  imports: [FontAwesomeModule, ConfirmBtn, EditModal],
  templateUrl: './single-task.html',
  styleUrl: './single-task.css',
})

export class SingleTask {
  faEdit = faEdit
  faTrash = faTrash
  taskData = input.required<TaskData>();
  deleteTask = output<string>();
  updateTask = output<TaskData>();
  openEditModal = signal<boolean>(false);

  toggleEditModal = (value: boolean) => {
    this.openEditModal.set(value);
  }

  delete() {
    this.deleteTask.emit(this.taskData().id);
  }
}
