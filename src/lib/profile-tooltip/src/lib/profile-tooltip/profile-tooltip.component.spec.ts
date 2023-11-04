import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileTooltipComponent } from './profile-tooltip.component';

describe('ProfileTooltipComponent', () => {
  let component: ProfileTooltipComponent;
  let fixture: ComponentFixture<ProfileTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileTooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
