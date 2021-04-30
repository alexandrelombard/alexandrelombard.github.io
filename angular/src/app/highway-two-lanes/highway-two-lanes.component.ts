import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

declare const mps: any;

@Component({
  selector: 'app-highway-two-lanes',
  templateUrl: './highway-two-lanes.component.html',
  styleUrls: ['./highway-two-lanes.component.scss']
})
export class HighwayTwoLanesComponent implements OnInit {

  constructor() { }

  @ViewChild('canvasElement', {static: true}) canvasElement: ElementRef;

  private simulationWebViewPackage = mps.fr.ciadlab.sim.infrastructure.viewjs;
  private simulationWebviewController;

  ngOnInit(): void {
    let canvasElementId = (<HTMLCanvasElement>this.canvasElement.nativeElement).id;

    this.simulationWebviewController =
      new this.simulationWebViewPackage.controllers.HighwayTwoLanesWebviewSimulationController();
    this.simulationWebviewController.load(canvasElementId);
  }


}
