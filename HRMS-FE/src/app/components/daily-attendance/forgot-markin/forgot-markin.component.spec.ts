import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotMarkinComponent } from './forgot-markin.component';

describe('ForgotMarkinComponent', () => {
  let component: ForgotMarkinComponent;
  let fixture: ComponentFixture<ForgotMarkinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotMarkinComponent]
    });
    fixture = TestBed.createComponent(ForgotMarkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
