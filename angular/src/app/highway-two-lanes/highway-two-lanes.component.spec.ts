import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighwayTwoLanesComponent } from './highway-two-lanes.component';

describe('HighwayTwoLanesComponent', () => {
  let component: HighwayTwoLanesComponent;
  let fixture: ComponentFixture<HighwayTwoLanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighwayTwoLanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighwayTwoLanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
