import { ComponentFixture, TestBed } from '@angular/core/testing';

import { List } from './list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List]
    })
    .compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('listData', {
      id: '1',
      title: 'To Do',
      order: 1,
      tasks: [],
    });
    fixture.componentRef.setInput('connectedList', ['1']);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
