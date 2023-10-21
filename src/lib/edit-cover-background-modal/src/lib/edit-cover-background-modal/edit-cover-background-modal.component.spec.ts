import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCoverBackgroundModalComponent } from './edit-cover-background-modal.component';

describe('EditCoverBackgroundModalComponent', () => {
  let component: EditCoverBackgroundModalComponent;
  let fixture: ComponentFixture<EditCoverBackgroundModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCoverBackgroundModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCoverBackgroundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
