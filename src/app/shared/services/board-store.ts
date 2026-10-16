import { computed, effect, Injectable, signal } from '@angular/core';
import { ListData, Result, TaskData } from '../models/board.model';

const STORAGE_KEY = 'kanban-lists';

const ok: Result = { ok: true };
const fail = (error: string): Result => ({ ok: false, error });

@Injectable({ providedIn: 'root' })
export class BoardStore {
  private readonly _lists = signal<ListData[]>(loadLists());

  readonly lists = this._lists.asReadonly();
  readonly listIds = computed(() => this._lists().map((list) => list.id));

  constructor() {
    effect(() => persistLists(this._lists()));
  }

  //////////////////// lists ////////////////////

  addList(rawTitle: string): Result {
    const title = rawTitle.trim();

    if (!title) {
      return fail('Column title is required');
    }

    if (this.listTitleTaken(title)) {
      return fail('Column name already exists');
    }

    this._lists.update((lists) =>
      withOrder([...lists, { id: newId(), title, order: 0, tasks: [] }]),
    );

    return ok;
  }

  renameList(listId: string, rawTitle: string): Result {
    const title = rawTitle.trim();

    if (!title) {
      return fail('Column title is required');
    }

    if (this.listTitleTaken(title, listId)) {
      return fail('Column name already exists');
    }

    this._lists.update((lists) =>
      lists.map((list) => (list.id === listId ? { ...list, title } : list)),
    );

    return ok;
  }

  deleteList(listId: string): void {
    this._lists.update((lists) => withOrder(lists.filter((list) => list.id !== listId)));
  }

  moveList(fromIndex: number, toIndex: number): void {
    this._lists.update((lists) => withOrder(moveInArray(lists, fromIndex, toIndex)));
  }

  //////////////////// tasks ////////////////////

  addTask(listId: string, rawTitle: string): Result {
    const title = rawTitle.trim();

    if (!title) {
      return fail('Task title is required');
    }

    const list = this.findList(listId);

    if (!list) {
      return fail('Column not found');
    }

    if (taskTitleTaken(list, title)) {
      return fail('Task name already exists');
    }

    const task: TaskData = {
      id: newId(),
      title,
      description: '',
      priority: null,
      tags: [],
      order: 0,
    };

    this.updateTasks(listId, (tasks) => [...tasks, task]);

    return ok;
  }

  updateTask(listId: string, updated: TaskData): Result {
    const title = updated.title.trim();

    if (!title) {
      return fail('Task title is required');
    }

    const list = this.findList(listId);

    if (!list) {
      return fail('Column not found');
    }

    if (taskTitleTaken(list, title, updated.id)) {
      return fail('Task name already exists');
    }

    this.updateTasks(listId, (tasks) =>
      tasks.map((task) => (task.id === updated.id ? { ...updated, title } : task)),
    );

    return ok;
  }

  deleteTask(listId: string, taskId: string): void {
    this.updateTasks(listId, (tasks) => tasks.filter((task) => task.id !== taskId));
  }

  moveTask(fromListId: string, toListId: string, fromIndex: number, toIndex: number): void {
    if (fromListId === toListId) {
      this.updateTasks(fromListId, (tasks) => moveInArray(tasks, fromIndex, toIndex));
      return;
    }

    const source = this.findList(fromListId);
    const target = this.findList(toListId);
    const moved = source?.tasks[fromIndex];

    if (!source || !target || !moved) {
      return;
    }

    const remaining = source.tasks.filter((_, index) => index !== fromIndex);
    const received = [...target.tasks.slice(0, toIndex), moved, ...target.tasks.slice(toIndex)];

    this._lists.update((lists) =>
      lists.map((list) => {
        if (list.id === fromListId) {
          return { ...list, tasks: withOrder(remaining) };
        }

        if (list.id === toListId) {
          return { ...list, tasks: withOrder(received) };
        }

        return list;
      }),
    );
  }

  //////////////////// internals ////////////////////

  private findList(listId: string): ListData | undefined {
    return this._lists().find((list) => list.id === listId);
  }

  private listTitleTaken(title: string, exceptListId?: string): boolean {
    return this._lists().some((list) => list.id !== exceptListId && sameTitle(list.title, title));
  }

  private updateTasks(listId: string, change: (tasks: TaskData[]) => TaskData[]): void {
    this._lists.update((lists) =>
      lists.map((list) =>
        list.id === listId ? { ...list, tasks: withOrder(change(list.tasks)) } : list,
      ),
    );
  }
}

function taskTitleTaken(list: ListData, title: string, exceptTaskId?: string): boolean {
  return list.tasks.some((task) => task.id !== exceptTaskId && sameTitle(task.title, title));
}

function sameTitle(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function withOrder<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, index) => ({ ...item, order: index + 1 }));
}

function moveInArray<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const copy = [...items];
  const [moved] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, moved);
  return copy;
}

function newId(): string {
  return typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadLists(): ListData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultLists();
    }

    const parsed: unknown = JSON.parse(saved);

    return isListData(parsed) ? sortByOrder(parsed) : defaultLists();
  } catch {
    return defaultLists();
  }
}

function persistLists(lists: ListData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch {}
}

function isListData(value: unknown): value is ListData[] {
  return (
    Array.isArray(value) &&
    value.every(
      (list) =>
        !!list &&
        typeof list === 'object' &&
        typeof list.id === 'string' &&
        typeof list.title === 'string' &&
        Array.isArray(list.tasks),
    )
  );
}

function sortByOrder(lists: ListData[]): ListData[] {
  return [...lists]
    .sort((a, b) => a.order - b.order)
    .map((list) => ({ ...list, tasks: [...list.tasks].sort((a, b) => a.order - b.order) }));
}

function defaultLists(): ListData[] {
  return [
    {
      id: newId(),
      title: 'To Do',
      order: 1,
      tasks: [
        {
          id: newId(),
          title: 'Task 1',
          description: 'Description for Task 1',
          priority: 'high',
          tags: ['tag1', 'tag2'],
          order: 1,
        },
        {
          id: newId(),
          title: 'Task 2',
          description: 'Description for Task 2',
          priority: 'medium',
          tags: ['tag3'],
          order: 2,
        },
      ],
    },
    {
      id: newId(),
      title: 'In Progress',
      order: 2,
      tasks: [
        {
          id: newId(),
          title: 'Task 3',
          description: 'Description for Task 3',
          priority: 'low',
          tags: ['tag-1'],
          order: 1,
        },
      ],
    },
    {
      id: newId(),
      title: 'Done',
      order: 3,
      tasks: [],
    },
  ];
}
