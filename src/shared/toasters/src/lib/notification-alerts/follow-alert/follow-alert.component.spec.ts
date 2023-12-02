import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowAlertComponent } from './follow-alert.component';

describe('FollowAlertComponent', () => {
  let component: FollowAlertComponent;
  let fixture: ComponentFixture<FollowAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
