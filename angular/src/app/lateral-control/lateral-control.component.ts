import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import Chart from 'chart.js';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CodeModel} from "@ngstack/code-editor";

declare const simViewApp: any;

let defaultCustomCommand =
  'let position = vehicle.position;\n' +
  'let velocity = vehicle.velocity;\n' +
  '\n' +
  'let laneWidth = 3.5;\n' +
  'let lane = driverBehavioralState.currentRoad.lane(driverBehavioralState.currentLaneIndex, laneWidth);\n' +
  '\n' +
  'let wheelAngle = 0.0;\n' +
  'let acceleration = 0.0;\n' +
  'return {targetAcceleration: acceleration, targetWheelAngle: wheelAngle};\n';

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
  simulatedPositionError: boolean = true;
  simulatedDirectionError: boolean = true;
  simulatedLatency: boolean = true;

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

    // Remove the custom command if any
    this.simulationWebviewController.customCommand = null;

    // Apply the selected strategy
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
      defaultCustomCommand = result;  // So the user don't have to rewrite it when he/she goes back to it
      console.log('Custom command: ' + result);
      const wrapper = new Function('vehicle', 'driverBehavioralState', result);
      this.simulationWebviewController.customCommand = function(vehicle, driverBehavioralState) {
        return wrapper(vehicle, driverBehavioralState);
      };
    });
  }

  /**
   * Exports measures as a JSON file
   */
  exportMeasures() {
    let dl = document.createElement("a");
    dl.id = "download";
    dl.download = "data_" + Date.now() + ".json";
    dl.href = URL.createObjectURL(new Blob([JSON.stringify(
      {
        lateralError: this.chart.data.datasets[0].data,
        angleError: this.chart.data.datasets[1].data,
      }
    )]));
    dl.click();
  }
}

function wrapper(callback,) {
  return callback()
}

export interface CustomCommandDialogData {
  customCommand: string;
}

@Component({
  selector: 'custom-lateral-control-dialog',
  templateUrl: 'custom-lateral-control-dialog.html'
})
export class CustomLateralControlDialog {
  codeModel: CodeModel;

  constructor(
    public dialogRef: MatDialogRef<CustomLateralControlDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CustomCommandDialogData) {

    this.codeModel = {
      language: 'javascript',
      uri: 'main.js',
      value: this.data.customCommand,
    }

  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onCodeChanged($event: string) {
    this.data.customCommand = $event;
  }
}
