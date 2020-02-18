import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

// import { simviewjs } from 'sim-view-js';

// import * as simViewApp from 'src/assets/js/sim-view-js/sim-view-js.js'
declare const simViewApp: any;
//declare const simViewApp.fr.ciadlab.sim.infrastructure.viewjs.controllers.WebviewSimulationController(canvasId: string): any;

export interface LateralControlStrategy {
  value: string,
  viewValue: string
}

@Component({
  selector: 'app-lateral-control',
  templateUrl: './lateral-control.component.html',
  styleUrls: ['./lateral-control.component.scss']
})
export class LateralControlComponent implements OnInit {

  constructor() { }

  @ViewChild('canvasElement', {static: true}) canvasElement: ElementRef;

  selectedStrategy: string;

  strategies: LateralControlStrategy[] = [
    { value: 'pure-pursuit', viewValue: 'Pure-Pursuit' },
    { value: 'stanley', viewValue: 'Stanley\'s Command' },
    { value: 'curvature-following', viewValue: 'Curvature Following' }
  ];

  ngOnInit(): void {
    this.selectedStrategy = this.strategies[0].value;

    let canvasElementId = (<HTMLCanvasElement>this.canvasElement.nativeElement).id;

    let simulationWebviewController =
      new simViewApp.fr.ciadlab.sim.infrastructure.viewjs.controllers.WebviewSimulationController();
    simulationWebviewController.load(canvasElementId);
  }

}
