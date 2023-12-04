import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentNotificationCardComponent } from './comment-notification-card.component';

describe('CommentNotificationCardComponent', () => {
  let component: CommentNotificationCardComponent;
  let fixture: ComponentFixture<CommentNotificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentNotificationCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentNotificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
