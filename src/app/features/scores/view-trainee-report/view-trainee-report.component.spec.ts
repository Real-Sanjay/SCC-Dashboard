import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTraineeReportComponent } from './view-trainee-report.component';

describe('ViewTraineeReportComponent', () => {
  let component: ViewTraineeReportComponent;
  let fixture: ComponentFixture<ViewTraineeReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTraineeReportComponent]
    });
    fixture = TestBed.createComponent(ViewTraineeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
