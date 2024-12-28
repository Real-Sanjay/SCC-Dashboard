import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScoreCardComponent } from './create-score-card.component';

describe('CreateScoreCardComponent', () => {
  let component: CreateScoreCardComponent;
  let fixture: ComponentFixture<CreateScoreCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateScoreCardComponent]
    });
    fixture = TestBed.createComponent(CreateScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
