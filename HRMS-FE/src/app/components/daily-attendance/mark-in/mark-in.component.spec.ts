import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkInComponent } from './mark-in.component';

describe('MarkInComponent', () => {
  let component: MarkInComponent;
  let fixture: ComponentFixture<MarkInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarkInComponent]
    });
    fixture = TestBed.createComponent(MarkInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
