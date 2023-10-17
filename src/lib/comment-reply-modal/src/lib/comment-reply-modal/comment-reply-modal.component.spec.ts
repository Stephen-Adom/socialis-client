import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentReplyModalComponent } from './comment-reply-modal.component';

describe('CommentReplyModalComponent', () => {
  let component: CommentReplyModalComponent;
  let fixture: ComponentFixture<CommentReplyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentReplyModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentReplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
