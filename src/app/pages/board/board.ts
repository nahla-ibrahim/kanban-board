import { Component, inject } from '@angular/core';
import { AddNewList } from '../../shared/components/add-new-list/add-new-list';
import { List } from '../../shared/components/list/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ListData, Result, TaskData } from '../../shared/models/board.model';
import { BoardStore } from '../../shared/services/board-store';

@Component({
  selector: 'app-board',
  imports: [AddNewList, List, CdkDropList, CdkDrag],
  templateUrl: './board.html',
})
export class Board {
  private readonly store = inject(BoardStore);
  private readonly snackBar = inject(MatSnackBar);

  lists = this.store.lists;
  connectedList = this.store.listIds;

  addNewList(listTitle: string) {
    this.notify(this.store.addList(listTitle), 'Column added successfully');
  }

  drop(event: CdkDragDrop<ListData[]>) {
    // Columns can only be reordered within their own container.
    if (event.previousContainer !== event.container) {
      return;
    }

    this.store.moveList(event.previousIndex, event.currentIndex);
  }

  dropTask(event: CdkDragDrop<TaskData[]>) {
    // Ignore anything that did not come from, or land in, a task container.
    const taskContainers = this.connectedList();

    if (
      !taskContainers.includes(event.previousContainer.id) ||
      !taskContainers.includes(event.container.id)
    ) {
      return;
    }

    this.store.moveTask(
      event.previousContainer.id,
      event.container.id,
      event.previousIndex,
      event.currentIndex,
    );
  }

  private notify(result: Result, successMessage: string) {
    this.snackBar.open(result.ok ? successMessage : result.error, 'Close', {
      duration: 3000,
    });
  }
}
