import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLetterComponent } from './credit-letter.component';

describe('CreditLetterComponent', () => {
  let component: CreditLetterComponent;
  let fixture: ComponentFixture<CreditLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditLetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
