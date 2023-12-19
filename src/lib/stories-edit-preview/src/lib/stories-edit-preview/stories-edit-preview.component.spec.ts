import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoriesEditPreviewComponent } from './stories-edit-preview.component';

describe('StoriesEditPreviewComponent', () => {
  let component: StoriesEditPreviewComponent;
  let fixture: ComponentFixture<StoriesEditPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesEditPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoriesEditPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
