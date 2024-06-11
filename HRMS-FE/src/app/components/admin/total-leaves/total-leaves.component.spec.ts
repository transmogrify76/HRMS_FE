import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLeavesComponent } from './total-leaves.component';

describe('TotalLeavesComponent', () => {
  let component: TotalLeavesComponent;
  let fixture: ComponentFixture<TotalLeavesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalLeavesComponent]
    });
    fixture = TestBed.createComponent(TotalLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
