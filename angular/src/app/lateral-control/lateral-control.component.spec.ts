import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateralControlComponent } from './lateral-control.component';

describe('LateralControlComponent', () => {
  let component: LateralControlComponent;
  let fixture: ComponentFixture<LateralControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateralControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateralControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
