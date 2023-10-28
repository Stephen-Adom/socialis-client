import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionInProgressComponent } from './action-in-progress.component';

describe('ActionInProgressComponent', () => {
  let component: ActionInProgressComponent;
  let fixture: ComponentFixture<ActionInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionInProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
