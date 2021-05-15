import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleVaccinationComponent } from './schedule-vaccination.component';

describe('ScheduleVaccinationComponent', () => {
  let component: ScheduleVaccinationComponent;
  let fixture: ComponentFixture<ScheduleVaccinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleVaccinationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleVaccinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
