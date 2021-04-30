import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LateralControlComponent} from "./lateral-control/lateral-control.component";
import {TwoIntersectionsComponent} from "./two-intersections/two-intersections.component";
import {HighwayTwoLanesComponent} from "./highway-two-lanes/highway-two-lanes.component";


const routes: Routes = [
  { path: 'lateral-control', component: LateralControlComponent },
  { path: 'two-intersections', component: TwoIntersectionsComponent },
  { path: 'highway-two-lanes', component: HighwayTwoLanesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
