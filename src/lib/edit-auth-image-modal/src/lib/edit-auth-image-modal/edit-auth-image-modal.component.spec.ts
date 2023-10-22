import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAuthImageModalComponent } from './edit-auth-image-modal.component';

describe('EditAuthImageModalComponent', () => {
  let component: EditAuthImageModalComponent;
  let fixture: ComponentFixture<EditAuthImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAuthImageModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAuthImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
