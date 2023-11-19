import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCardSummaryComponent } from './event-card-summary.component';

describe('EventCardSummaryComponent', () => {
  let component: EventCardSummaryComponent;
  let fixture: ComponentFixture<EventCardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
