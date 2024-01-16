import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadMorePostButtonComponent } from './load-more-post-button.component';

describe('LoadMorePostButtonComponent', () => {
  let component: LoadMorePostButtonComponent;
  let fixture: ComponentFixture<LoadMorePostButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadMorePostButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadMorePostButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
