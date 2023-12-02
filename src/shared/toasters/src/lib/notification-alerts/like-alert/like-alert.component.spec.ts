import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeAlertComponent } from './like-alert.component';

describe('LikeAlertComponent', () => {
  let component: LikeAlertComponent;
  let fixture: ComponentFixture<LikeAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikeAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LikeAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
