import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllUserRepliesComponent } from './all-user-replies.component';

describe('AllUserRepliesComponent', () => {
  let component: AllUserRepliesComponent;
  let fixture: ComponentFixture<AllUserRepliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUserRepliesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllUserRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
