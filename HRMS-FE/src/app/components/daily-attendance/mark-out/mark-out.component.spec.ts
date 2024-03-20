import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkOutComponent } from './mark-out.component';

describe('MarkOutComponent', () => {
  let component: MarkOutComponent;
  let fixture: ComponentFixture<MarkOutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarkOutComponent]
    });
    fixture = TestBed.createComponent(MarkOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
