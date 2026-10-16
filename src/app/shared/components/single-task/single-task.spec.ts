import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTask } from './single-task';

describe('SingleTask', () => {
  let component: SingleTask;
  let fixture: ComponentFixture<SingleTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTask);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('taskData', {
      id: '1',
      title: 'Task 1',
      description: '',
      priority: 'high',
      tags: ['bug'],
      order: 1,
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the task title, its tag and its priority', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(text).toContain('Task 1');
    expect(text).toContain('bug');
    expect(text).toContain('High');
  });
});
