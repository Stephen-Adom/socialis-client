import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoInternetAlertComponent } from './no-internet-alert.component';

describe('NoInternetAlertComponent', () => {
  let component: NoInternetAlertComponent;
  let fixture: ComponentFixture<NoInternetAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoInternetAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoInternetAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
