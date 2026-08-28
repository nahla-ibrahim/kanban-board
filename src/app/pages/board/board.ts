import { Component, computed, effect, inject, signal } from '@angular/core';
import { AddNewList } from '../../shared/components/add-new-list/add-new-list';
import { List } from '../../shared/components/list/list';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  constructor() {
    const savedLists = localStorage.getItem('kanban-lists');

    if (savedLists) {
      this.lists.set(JSON.parse(savedLists));
    }
    effect(() => {
      localStorage.setItem('kanban-lists', JSON.stringify(this.lists()));
    });
  }

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

  private snackBar = inject(MatSnackBar);
  lists = signal<ListData[]>(this.defaultLists);
  connectedList = computed(() => this.lists().map((list) => list.id));
  addNewList(listTitle: string) {
    const title = listTitle.trim();

    if (!title) {
      this.snackBar.open('Column Title Needed', 'Close', {
        duration: 3000,
      });
      return;
    }
    const exists = this.lists().some((list) => list.title.toLowerCase() === title.toLowerCase());

    if (exists) {
      this.snackBar.open('Column name already exists', 'Close', {
        duration: 3000,
      });

      return;
    }
    this.lists.set([
      ...this.lists(),
      {
        id: crypto.randomUUID(),
        title: listTitle,
        order: this.lists().length + 1,
        tasks: [],
      },
    ]);
    this.snackBar.open('Column added successfully', 'Close', {
      duration: 3000,
    });
  }

  updateListData(listData: ListData) {
    this.lists.update((lists) => lists.map((list) => (list.id === listData.id ? listData : list)));
  }
  deleteColumn(columnId: string) {
    this.lists.update((lists) => lists.filter((list) => list.id !== columnId));
    this.snackBar.open('Column deleted successfully', 'Close', {
      duration: 3000,
    });
  }

  drop(event: CdkDragDrop<ListData[]>) {
    const lists = [...this.lists()];

    moveItemInArray(lists, event.previousIndex, event.currentIndex);

    const updatedLists = lists.map((list, index) => ({
      ...list,
      order: index + 1,
    }));

    this.lists.set(updatedLists);
    console.log(this.lists());
  }

  dropTask(event: CdkDragDrop<TaskData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((task, index) => {
        task.order = index + 1;
      });
      console.log(event.container.data);
      this.lists.update((lists) =>
        lists.map((list) =>
          list.id === event.container.id
            ? {
                ...list,
                tasks: event.container.data,
              }
            : list,
        ),
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      event.previousContainer.data.forEach((task, index) => {
        task.order = index + 1;
      });

      event.container.data.forEach((task, index) => {
        task.order = index + 1;
      });
      console.log(event.container.data);
      console.log(event.previousContainer.data);
      this.lists.update((lists) =>
        lists.map((list) => {
          if (list.id === event.previousContainer.id) {
            return {
              ...list,
              tasks: event.previousContainer.data,
            };
          }

          if (list.id === event.container.id) {
            return {
              ...list,
              tasks: event.container.data,
            };
          }

          return list;
        }),
      );
    }
  }
}
