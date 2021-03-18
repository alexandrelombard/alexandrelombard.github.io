import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoIntersectionsComponent } from './two-intersections.component';

describe('TwoIntersectionsComponent', () => {
  let component: TwoIntersectionsComponent;
  let fixture: ComponentFixture<TwoIntersectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoIntersectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoIntersectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
