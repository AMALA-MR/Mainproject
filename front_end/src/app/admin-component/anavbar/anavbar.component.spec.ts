import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnavbarComponent } from './anavbar.component';

describe('AnavbarComponent', () => {
  let component: AnavbarComponent;
  let fixture: ComponentFixture<AnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
