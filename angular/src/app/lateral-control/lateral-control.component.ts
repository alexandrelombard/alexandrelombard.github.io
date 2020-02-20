import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import Chart from 'chart.js';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

declare const simViewApp: any;

const defaultCustomCommand =
  'function(vehicle, driveBehavioralState) {\n' +
  '\tlet position = vehicle.position;\n' +
  '\tlet velocity = vehicle.velocity;\n' +
  '\t\n' +
  '\tlet laneWidth = 3.5;\n' +
  '\tlet laneOffset = driverBehavioralState.currentRoad.laneOffset(driverBehavioralState.currentLaneIndex);\n' +
  '\tlet lane = driverBehavioralState.currentRoad.points.offset(laneOffset * laneWidth);\n' +
  '\t\n' +
  '\tlet wheelAngle = 0.0;\n' +
  '\tlet acceleration = 0.0;\n' +
  '\treturn new DriverBehavioralAction(acceleration, wheelAngle);\n' +
  '}';

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

  constructor(public dialog: MatDialog) {
  }

  @ViewChild('canvasElement', {static: true}) canvasElement: ElementRef;
  @ViewChild('chartElement', {static: true}) chartElement: ElementRef;

  selectedStrategy: string;
  simulatedPositionError: boolean = false;
  simulatedDirectionError: boolean = false;
  simulatedLatency: boolean = false;

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
        if (time > that.lastStatMeasureTime + that.statsPeriod) {
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
            lineTension: 0.0,
            showLine: true,
            data: []
          },
          {
            label: 'Angle Error',
            backgroundColor: "rgba(0.0, 0.0, 0.0, 0.0)",
            borderColor: "rgb(128, 99, 255)",
            lineTension: 0.0,
            showLine: true,
            data: []
          }
        ]
      },
      options: {
        responsive: false,
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

  /**
   * Update the simulated errors according to the current state of errors
   */
  updateErrors(): void {
    console.log('Errors update: ' + this.simulatedPositionError + ", " + this.simulatedDirectionError);

    this.simulationWebviewController.simulatedPositionError = this.simulatedDirectionError;
    this.simulationWebviewController.simulatedDirectionError = this.simulatedDirectionError;
    this.simulationWebviewController.simulatedLatency = this.simulatedLatency;
  }

  /**
   * Show a popup the user can use to propose his/her own command
   */
  showCustomCommandPopup() {
    const dialogRef = this.dialog.open(CustomLateralControlDialog, {
      height: '600px',
      width: '1200px',
      data: {customCommand: defaultCustomCommand}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Custom command: ' + result);
    });
  }
}

export interface CustomCommandDialogData {
  customCommand: string;
}

@Component({
  selector: 'custom-lateral-control-dialog',
  templateUrl: 'custom-lateral-control-dialog.html'
})
export class CustomLateralControlDialog {
  constructor(
    public dialogRef: MatDialogRef<CustomLateralControlDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CustomCommandDialogData) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
