import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import Chart from 'chart.js';

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
export class LateralControlComponent implements OnInit, AfterViewInit {

  constructor() {
  }

  @ViewChild('canvasElement', {static: true}) canvasElement: ElementRef;
  @ViewChild('chartElement', {static: true}) chartElement: ElementRef;

  selectedStrategy: string;

  strategies: LateralControlStrategy[] = [
    {value: 'pure-pursuit', viewValue: 'Pure-Pursuit'},
    {value: 'stanley', viewValue: 'Stanley\'s Command'},
    {value: 'curvature-following', viewValue: 'Curvature Following'}
  ];

  chart: Chart;

  private lastStatMeasureTime = 0.0;
  private statsPeriod = 0.2;

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

    const that = this;
    this.simulationWebviewController.onStatsReceived =
      function (time: number, model: string, lateralError: number, angleError: number) {
        if(time > that.lastStatMeasureTime + that.statsPeriod) {
          that.chart.data.datasets[0].data.push({x: time, y: lateralError});
          that.chart.data.datasets[1].data.push({x: time, y: angleError});
          that.chart.update(0);
          that.lastStatMeasureTime = time;
        }
      };
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    let chartCanvas = this.chartElement.nativeElement as HTMLCanvasElement;
    let ctx = chartCanvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        labels: ['Lateral Error'],
        datasets: [
          {
            label: 'Lateral Error',
            backgroundColor: "rgba(0.0, 0.0, 0.0, 0.0)",
            borderColor: "rgb(255, 99, 132)",
            showLine: true,
            data: []
          },
          {
            label: 'Angle Error',
            backgroundColor: "rgba(0.0, 0.0, 0.0, 0.0)",
            borderColor: "rgb(128, 99, 255)",
            showLine: true,
            data: []
          }
        ]
      },
      options: {
        responsive:false,
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  /**
   * Update the strategy according to the currently selected strategy
   */
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
