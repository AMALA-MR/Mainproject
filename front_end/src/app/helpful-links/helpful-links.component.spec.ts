import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpfulLinksComponent } from './helpful-links.component';

describe('HelpfulLinksComponent', () => {
  let component: HelpfulLinksComponent;
  let fixture: ComponentFixture<HelpfulLinksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpfulLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpfulLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
