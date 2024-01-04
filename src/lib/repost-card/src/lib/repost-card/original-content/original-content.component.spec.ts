import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginalContentComponent } from './original-content.component';

describe('OriginalContentComponent', () => {
  let component: OriginalContentComponent;
  let fixture: ComponentFixture<OriginalContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OriginalContentComponent]
    });
    fixture = TestBed.createComponent(OriginalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
