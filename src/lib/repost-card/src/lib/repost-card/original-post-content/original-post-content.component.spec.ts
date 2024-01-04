import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OriginalPostContentComponent } from './original-post-content.component';

describe('OriginalPostContentComponent', () => {
  let component: OriginalPostContentComponent;
  let fixture: ComponentFixture<OriginalPostContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginalPostContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OriginalPostContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
