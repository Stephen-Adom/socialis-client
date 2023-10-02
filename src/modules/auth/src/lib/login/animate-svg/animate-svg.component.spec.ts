import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimateSvgComponent } from './animate-svg.component';

describe('AnimateSvgComponent', () => {
  let component: AnimateSvgComponent;
  let fixture: ComponentFixture<AnimateSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimateSvgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimateSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
