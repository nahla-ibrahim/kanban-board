import { Component, input, output, signal } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from "@fortawesome/angular-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-confirm-btn',
  imports: [FontAwesomeModule],
  templateUrl: './confirm-btn.html',
})
export class ConfirmBtn {
  faClose = faClose;
  icon = input.required<IconDefinition>();
  message = input.required<string>();
  action = output<void>();
  btnClass = input<string>();

  openModal = signal<boolean>(false);

  toggleModal = (value: boolean) => {
    this.openModal.set(value);
  }
  
  confirmAction = () => {
    this.action.emit();
    this.toggleModal(false);
  }
}
