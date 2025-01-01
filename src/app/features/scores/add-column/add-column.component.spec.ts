import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColumnComponent } from './add-column.component';

describe('AddColumnComponent', () => {
  let component: AddColumnComponent;
  let fixture: ComponentFixture<AddColumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddColumnComponent]
    });
    fixture = TestBed.createComponent(AddColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
