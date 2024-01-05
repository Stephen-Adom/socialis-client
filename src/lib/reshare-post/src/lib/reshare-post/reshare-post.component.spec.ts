import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResharePostComponent } from './reshare-post.component';

describe('ResharePostComponent', () => {
  let component: ResharePostComponent;
  let fixture: ComponentFixture<ResharePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResharePostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResharePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
