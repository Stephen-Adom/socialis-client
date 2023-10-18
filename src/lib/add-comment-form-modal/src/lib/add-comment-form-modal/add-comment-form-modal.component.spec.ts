import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCommentFormModalComponent } from './add-comment-form-modal.component';

describe('AddCommentFormModalComponent', () => {
  let component: AddCommentFormModalComponent;
  let fixture: ComponentFixture<AddCommentFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCommentFormModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCommentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
