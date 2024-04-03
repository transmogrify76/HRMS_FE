import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfEmployeesComponent } from './list-of-employees.component';

describe('ListOfEmployeesComponent', () => {
  let component: ListOfEmployeesComponent;
  let fixture: ComponentFixture<ListOfEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfEmployeesComponent]
    });
    fixture = TestBed.createComponent(ListOfEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
