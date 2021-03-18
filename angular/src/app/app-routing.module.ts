import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LateralControlComponent} from "./lateral-control/lateral-control.component";
import {TwoIntersectionsComponent} from "./two-intersections/two-intersections.component";


const routes: Routes = [
  { path: 'lateral-control', component: LateralControlComponent },
  { path: 'two-intersections', component: TwoIntersectionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
