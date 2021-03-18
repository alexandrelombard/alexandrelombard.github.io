import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

declare const mps: any;

@Component({
  selector: 'app-two-intersections',
  templateUrl: './two-intersections.component.html',
  styleUrls: ['./two-intersections.component.scss']
})
export class TwoIntersectionsComponent implements OnInit {

  constructor() { }

  @ViewChild('canvasElement', {static: true}) canvasElement: ElementRef;

  private simulationWebViewPackage = mps.fr.ciadlab.sim.infrastructure.viewjs;
  private simulationWebviewController;

  ngOnInit(): void {
    let canvasElementId = (<HTMLCanvasElement>this.canvasElement.nativeElement).id;

    this.simulationWebviewController =
      new this.simulationWebViewPackage.controllers.TwoIntersectionsWebviewSimulationController();
    this.simulationWebviewController.load(canvasElementId);
  }

}
