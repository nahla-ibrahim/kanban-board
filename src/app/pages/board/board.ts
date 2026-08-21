import { Component, computed, signal } from '@angular/core';
import { AddNewList } from '../../shared/components/add-new-list/add-new-list';
import { List } from '../../shared/components/list/list';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
export type Title = {
  title: string;
};

export interface TaskData extends Title {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | null;
  tags: string[];
  order: number;
}

export interface ListData extends Title {
  id: string;
  order: number;
  tasks: TaskData[];
}

@Component({
  selector: 'app-board',
  imports: [AddNewList, List, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  defaultLists: ListData[] = [
    {
      id: crypto.randomUUID(),
      title: 'To Do',
      order: 1,
      tasks: [
        {
          id: crypto.randomUUID(),
          title: 'Task 1',
          description: 'Description for Task 1',
          priority: 'high',
          tags: ['tag1', 'tag2'],
          order: 1,
        },
        {
          id: crypto.randomUUID(),
          title: 'Task 2',
          description: 'Description for Task 2',
          priority: 'medium',
          tags: ['tag3'],
          order: 2,
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'In Progress',
      order: 2,
      tasks: [
        {
          id: crypto.randomUUID(),
          title: 'Task 3',
          description: 'Description for Task 3',
          priority: 'low',
          tags: ['tag-1'],
          order: 1,
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'Done',
      order: 3,
      tasks: [],
    },
  ];

  lists = signal<ListData[]>(this.defaultLists);

  connectedList = computed(() => this.lists().map((list) => list.id));
  addNewList(listTitle: string) {
    this.lists.set([
      ...this.lists(),
      {
        id: crypto.randomUUID(),
        title: listTitle,
        order: this.lists().length + 1,
        tasks: [],
      },
    ]);
  }

  updateListData(listData: ListData) {
    let allLists = this.lists();
    const selectedListIndex = allLists.findIndex((list) => list.id == listData.id);
    if (selectedListIndex >= 0) {
      allLists[selectedListIndex] = listData;
      this.lists.set(allLists);
    }
  }
  deleteColumn(columnId: string) {
    this.lists.update((lists) => lists.filter((list) => list.id !== columnId));
  }

  drop(event: CdkDragDrop<ListData[]>) {
    moveItemInArray(this.lists(), event.previousIndex, event.currentIndex);
  }

  dropTask(event: CdkDragDrop<TaskData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
