import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileCardSummaryComponent } from './profile-card-summary.component';

describe('ProfileCardSummaryComponent', () => {
  let component: ProfileCardSummaryComponent;
  let fixture: ComponentFixture<ProfileCardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCardSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileCardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
