import { Component, computed, input, output, signal } from '@angular/core';
import { TaskData } from '../../models/board.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAlignLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ConfirmBtn } from '../confirm-btn/confirm-btn';
import { EditModal } from '../edit-modal/edit-modal';

type PriorityStyle = { label: string; chip: string; dot: string };

const PRIORITY_STYLES: Record<NonNullable<TaskData['priority']>, PriorityStyle> = {
  high: { label: 'High', chip: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
  medium: { label: 'Medium', chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  low: { label: 'Low', chip: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
};

const TAG_COLORS = [
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
];

@Component({
  selector: 'app-single-task',
  imports: [FontAwesomeModule, ConfirmBtn, EditModal],
  templateUrl: './single-task.html',
})
export class SingleTask {
  faEdit = faEdit;
  faTrash = faTrash;
  faAlignLeft = faAlignLeft;
  taskData = input.required<TaskData>();
  deleteTask = output<string>();
  updateTask = output<TaskData>();
  openEditModal = signal<boolean>(false);

  priority = computed<PriorityStyle | null>(() => {
    const priority = this.taskData().priority;
    return priority ? PRIORITY_STYLES[priority] : null;
  });

  tagColor(tag: string): string {
    tag = tag.toLowerCase();
    let hash = 0;

    for (let i = 0; i < tag.length; i++) {
      hash = (hash * 31 + tag.charCodeAt(i)) | 0;
    }

    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
  }

  toggleEditModal = (value: boolean) => {
    this.openEditModal.set(value);
  };

  delete() {
    this.deleteTask.emit(this.taskData().id);
  }
}
