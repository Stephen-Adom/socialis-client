import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplyAlertComponent } from './reply-alert.component';

describe('ReplyAlertComponent', () => {
  let component: ReplyAlertComponent;
  let fixture: ComponentFixture<ReplyAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
