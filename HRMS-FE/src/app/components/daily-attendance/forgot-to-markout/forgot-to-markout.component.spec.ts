import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotToMarkoutComponent } from './forgot-to-markout.component';

describe('ForgotToMarkoutComponent', () => {
  let component: ForgotToMarkoutComponent;
  let fixture: ComponentFixture<ForgotToMarkoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotToMarkoutComponent]
    });
    fixture = TestBed.createComponent(ForgotToMarkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
