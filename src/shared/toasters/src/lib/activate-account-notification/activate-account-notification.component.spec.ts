import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivateAccountNotificationComponent } from './activate-account-notification.component';

describe('ActivateAccountNotificationComponent', () => {
  let component: ActivateAccountNotificationComponent;
  let fixture: ComponentFixture<ActivateAccountNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateAccountNotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateAccountNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
