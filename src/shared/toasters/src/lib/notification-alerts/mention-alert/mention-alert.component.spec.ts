import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentionAlertComponent } from './mention-alert.component';

describe('MentionAlertComponent', () => {
  let component: MentionAlertComponent;
  let fixture: ComponentFixture<MentionAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentionAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
