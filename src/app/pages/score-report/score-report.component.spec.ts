import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreReportComponent } from './score-report.component';

describe('ScoreReportComponent', () => {
  let component: ScoreReportComponent;
  let fixture: ComponentFixture<ScoreReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScoreReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
