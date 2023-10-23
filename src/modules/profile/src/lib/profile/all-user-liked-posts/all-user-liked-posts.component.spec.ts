import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllUserLikedPostsComponent } from './all-user-liked-posts.component';

describe('AllUserLikedPostsComponent', () => {
  let component: AllUserLikedPostsComponent;
  let fixture: ComponentFixture<AllUserLikedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUserLikedPostsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllUserLikedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
