import { Component, input, output } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TaskData } from '../../../pages/board/board';
@Component({
  selector: 'app-edit-modal',
  imports: [FontAwesomeModule],
  templateUrl: './edit-modal.html',
  styleUrl: './edit-modal.css',
})
export class EditModal {
  faClose = faClose;
  taskData = input.required<TaskData>();
  onClose = output<void>();
  onSave = output<TaskData>();
  
  closeModal = () => {
    this.onClose.emit();
  }
}
