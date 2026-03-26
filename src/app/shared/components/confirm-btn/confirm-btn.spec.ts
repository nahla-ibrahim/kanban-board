import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBtn } from './confirm-btn';

describe('ConfirmBtn', () => {
  let component: ConfirmBtn;
  let fixture: ComponentFixture<ConfirmBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
