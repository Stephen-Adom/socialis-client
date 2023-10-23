import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllUserPostComponent } from './all-user-post.component';

describe('AllUserPostComponent', () => {
  let component: AllUserPostComponent;
  let fixture: ComponentFixture<AllUserPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUserPostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllUserPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
