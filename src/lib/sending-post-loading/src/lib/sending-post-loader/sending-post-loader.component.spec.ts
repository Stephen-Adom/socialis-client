import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendingPostLoaderComponent } from './sending-post-loader.component';

describe('SendingPostLoaderComponent', () => {
  let component: SendingPostLoaderComponent;
  let fixture: ComponentFixture<SendingPostLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendingPostLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SendingPostLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
