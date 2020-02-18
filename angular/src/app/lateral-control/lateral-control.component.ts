import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

declare const simViewApp: any;

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

  private simulationWebViewPackage = simViewApp.fr.ciadlab.sim.infrastructure.viewjs;
  private simulationWebviewController;

  ngOnInit(): void {
    this.selectedStrategy = this.strategies[0].value;

    let canvasElementId = (<HTMLCanvasElement>this.canvasElement.nativeElement).id;

    this.simulationWebviewController =
      new this.simulationWebViewPackage.controllers.WebviewSimulationController();
    this.simulationWebviewController.load(canvasElementId);
    this.simulationWebviewController.lateralControlModel =
      this.simulationWebViewPackage.controllers.LateralControlModel.PURE_PURSUIT;
  }

  updateStrategy(): void {
    console.log('Strategy update: ' + this.selectedStrategy);

    switch (this.selectedStrategy) {
      case 'pure-pursuit':
        this.simulationWebviewController.lateralControlModel =
          this.simulationWebViewPackage.controllers.LateralControlModel.PURE_PURSUIT;
        break;
      case 'stanley':
        this.simulationWebviewController.lateralControlModel =
          this.simulationWebViewPackage.controllers.LateralControlModel.STANLEY;
        break;
      default:
        this.simulationWebviewController.lateralControlModel =
          this.simulationWebViewPackage.controllers.LateralControlModel.CURVATURE_FOLLOWING;
    }

  }

}
