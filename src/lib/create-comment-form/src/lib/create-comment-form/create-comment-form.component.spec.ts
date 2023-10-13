import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCommentFormComponent } from './create-comment-form.component';

describe('CreateCommentFormComponent', () => {
  let component: CreateCommentFormComponent;
  let fixture: ComponentFixture<CreateCommentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCommentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
