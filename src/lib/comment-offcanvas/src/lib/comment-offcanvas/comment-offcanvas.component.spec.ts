import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentOffcanvasComponent } from './comment-offcanvas.component';

describe('CommentOffcanvasComponent', () => {
  let component: CommentOffcanvasComponent;
  let fixture: ComponentFixture<CommentOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentOffcanvasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
