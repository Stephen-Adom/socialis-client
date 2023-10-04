import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotAnimateComponent } from './forgot-animate.component';

describe('ForgotAnimateComponent', () => {
  let component: ForgotAnimateComponent;
  let fixture: ComponentFixture<ForgotAnimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotAnimateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotAnimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
