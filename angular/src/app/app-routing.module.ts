import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LateralControlComponent} from "./lateral-control/lateral-control.component";


const routes: Routes = [
  { path: 'lateral-control', component: LateralControlComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
