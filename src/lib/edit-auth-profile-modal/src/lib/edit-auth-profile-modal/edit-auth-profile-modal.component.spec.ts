import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAuthProfileModalComponent } from './edit-auth-profile-modal.component';

describe('EditAuthProfileModalComponent', () => {
  let component: EditAuthProfileModalComponent;
  let fixture: ComponentFixture<EditAuthProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAuthProfileModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAuthProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
