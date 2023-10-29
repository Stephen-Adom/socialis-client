import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateReplyFormComponent } from './create-reply-form.component';

describe('CreateReplyFormComponent', () => {
  let component: CreateReplyFormComponent;
  let fixture: ComponentFixture<CreateReplyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReplyFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
