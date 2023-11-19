import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationOffcanvasComponent } from './notification-offcanvas.component';

describe('NotificationOffcanvasComponent', () => {
  let component: NotificationOffcanvasComponent;
  let fixture: ComponentFixture<NotificationOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationOffcanvasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
