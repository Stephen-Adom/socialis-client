import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoriesPreviewComponent } from './stories-preview.component';

describe('StoriesPreviewComponent', () => {
  let component: StoriesPreviewComponent;
  let fixture: ComponentFixture<StoriesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoriesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
