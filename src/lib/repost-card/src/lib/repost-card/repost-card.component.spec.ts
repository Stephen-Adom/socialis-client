import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepostCardComponent } from './repost-card.component';

describe('RepostCardComponent', () => {
  let component: RepostCardComponent;
  let fixture: ComponentFixture<RepostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepostCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
