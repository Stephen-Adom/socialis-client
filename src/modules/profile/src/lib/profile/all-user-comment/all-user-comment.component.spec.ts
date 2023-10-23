import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllUserCommentComponent } from './all-user-comment.component';

describe('AllUserCommentComponent', () => {
  let component: AllUserCommentComponent;
  let fixture: ComponentFixture<AllUserCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUserCommentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllUserCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
