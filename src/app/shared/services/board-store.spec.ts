import { TestBed } from '@angular/core/testing';

import { BoardStore } from './board-store';
import { ListData, TaskData } from '../models/board.model';

const STORAGE_KEY = 'kanban-lists';

function task(id: string, title: string): TaskData {
  return { id, title, description: '', priority: null, tags: [], order: 1 };
}

const savedBoard: ListData[] = [
  { id: 'todo', title: 'To Do', order: 1, tasks: [task('a', 'Task A'), task('b', 'Task B')] },
  { id: 'done', title: 'Done', order: 2, tasks: [] },
];

describe('BoardStore', () => {
  let store: BoardStore;

  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBoard));
    store = TestBed.inject(BoardStore);
  });

  function titlesIn(listId: string): string[] {
    return store.lists().find((list) => list.id === listId)!.tasks.map((task) => task.title);
  }

  describe('columns', () => {
    it('should add a column with the title trimmed', () => {
      store.addList('  Backlog  ');

      expect(store.lists().map((list) => list.title)).toEqual(['To Do', 'Done', 'Backlog']);
    });

    it('should reject an empty column title', () => {
      const result = store.addList('   ');

      expect(result).toEqual({ ok: false, error: 'Column title is required' });
    });

    it('should reject a column title that already exists', () => {
      const result = store.addList('to do');

      expect(result).toEqual({ ok: false, error: 'Column name already exists' });
    });

    it('should rename a column', () => {
      store.renameList('todo', 'Doing');

      expect(store.lists()[0].title).toBe('Doing');
    });

    it('should delete a column', () => {
      store.deleteList('todo');

      expect(store.lists().map((list) => list.id)).toEqual(['done']);
    });
  });

  describe('tasks', () => {
    it('should add a task to the chosen column', () => {
      store.addTask('done', 'Task C');

      expect(titlesIn('done')).toEqual(['Task C']);
    });

    it('should reject a task title that already exists in the same column', () => {
      const result = store.addTask('todo', 'task a');

      expect(result).toEqual({ ok: false, error: 'Task name already exists' });
    });

    it('should allow the same task title in another column', () => {
      const result = store.addTask('done', 'Task A');

      expect(result).toEqual({ ok: true });
    });

    it('should delete a task', () => {
      store.deleteTask('todo', 'a');

      expect(titlesIn('todo')).toEqual(['Task B']);
    });
  });

  describe('moving tasks', () => {
    it('should reorder a task inside its own column', () => {
      store.moveTask('todo', 'todo', 0, 1);

      expect(titlesIn('todo')).toEqual(['Task B', 'Task A']);
    });

    it('should move a task to another column', () => {
      store.moveTask('todo', 'done', 0, 0);

      expect(titlesIn('todo')).toEqual(['Task B']);
      expect(titlesIn('done')).toEqual(['Task A']);
    });

    it('should number the tasks again after a move', () => {
      store.moveTask('todo', 'todo', 0, 1);

      expect(store.lists()[0].tasks.map((task) => task.order)).toEqual([1, 2]);
    });
  });

  describe('saved data', () => {
    it('should use the default board when the saved data is broken', () => {
      localStorage.setItem(STORAGE_KEY, 'not json');
      TestBed.resetTestingModule();

      expect(TestBed.inject(BoardStore).lists().length).toBe(3);
    });
  });
});
