import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentAlertComponent } from './comment-alert.component';

describe('CommentAlertComponent', () => {
  let component: CommentAlertComponent;
  let fixture: ComponentFixture<CommentAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
