import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorySlideComponent } from './story-slide.component';

describe('StorySlideComponent', () => {
  let component: StorySlideComponent;
  let fixture: ComponentFixture<StorySlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorySlideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorySlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
