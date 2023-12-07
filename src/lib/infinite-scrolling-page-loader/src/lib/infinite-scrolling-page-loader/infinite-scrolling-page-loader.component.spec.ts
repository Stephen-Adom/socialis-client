import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfiniteScrollingPageLoaderComponent } from './infinite-scrolling-page-loader.component';

describe('InfiniteScrollingPageLoaderComponent', () => {
  let component: InfiniteScrollingPageLoaderComponent;
  let fixture: ComponentFixture<InfiniteScrollingPageLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteScrollingPageLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfiniteScrollingPageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
