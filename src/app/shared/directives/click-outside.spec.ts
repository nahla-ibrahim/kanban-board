import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClickOutsideDirective } from './click-outside';

@Component({
  imports: [ClickOutsideDirective],
  template: '<div (clickOutside)="closed = true"></div>',
})
class HostComponent {
  closed = false;
}

describe('ClickOutside', () => {
  it('should create an instance', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();

    const directive = fixture.debugElement
      .query(By.directive(ClickOutsideDirective))
      .injector.get(ClickOutsideDirective);

    expect(directive).toBeTruthy();
  });
});
