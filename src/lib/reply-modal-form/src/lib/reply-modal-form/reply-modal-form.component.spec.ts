import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplyModalFormComponent } from './reply-modal-form.component';

describe('ReplyModalFormComponent', () => {
  let component: ReplyModalFormComponent;
  let fixture: ComponentFixture<ReplyModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyModalFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
