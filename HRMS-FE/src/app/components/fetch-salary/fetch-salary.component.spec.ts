import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchSalaryComponent } from './fetch-salary.component';

describe('FetchSalaryComponent', () => {
  let component: FetchSalaryComponent;
  let fixture: ComponentFixture<FetchSalaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FetchSalaryComponent]
    });
    fixture = TestBed.createComponent(FetchSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
