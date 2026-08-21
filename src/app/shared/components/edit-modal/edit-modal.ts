import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TaskData } from '../../../pages/board/board';
import { form, required, Field } from '@angular/forms/signals';
@Component({
  selector: 'app-edit-modal',
  imports: [FontAwesomeModule, Field],
  templateUrl: './edit-modal.html',
  styleUrl: './edit-modal.css',
})
export class EditModal {
  faClose = faClose;
  taskData = input.required<TaskData>();
  onClose = output<void>();
  onSave = output<TaskData>();

  editTask = signal({
    title: '',
    description: '',
    priority: null as TaskData['priority'],
    tags: [] as string[],
  });

  constructor() {
    effect(() => {
      const task = this.taskData();

      this.editTask.set({
        title: task.title,
        description: task.description,
        priority: task.priority,
        tags: [...task.tags],
      });
    });
  }

  editTaskForm = form(this.editTask, (schema) => {
    required(schema.title, {
      message: 'The title is required',
    });
  });

  addTag(input: HTMLInputElement) {
    const value = input.value.trim();

    if (!value) {
      return;
    }

    this.editTask.update((task) => ({
      ...task,
      tags: [...task.tags, value],
    }));

    input.value = '';
  }
  removeTag(tag: string) {
    this.editTask.update((task) => ({
      ...task,
      tags: task.tags.filter((t) => t !== tag),
    }));
  }
  save() {
    if (this.editTaskForm().invalid()) {
      return;
    }

    const updatedTask: TaskData = {
      ...this.taskData(),
      ...this.editTask(),
    };

    this.onSave.emit(updatedTask);
    this.closeModal();
  }

  setPriority(priority: TaskData['priority']) {
    this.editTask.update((task) => ({
      ...task,
      priority,
    }));
  }
  closeModal() {
    this.onClose.emit();
  }
}
