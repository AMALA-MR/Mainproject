import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavbarComponent } from './unavbar.component';

describe('UnavbarComponent', () => {
  let component: UnavbarComponent;
  let fixture: ComponentFixture<UnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
