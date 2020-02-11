import { Component, OnInit } from '@angular/core';

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

  selectedStrategy: string;

  strategies: LateralControlStrategy[] = [
    { value: 'pure-pursuit', viewValue: 'Pure-Pursuit' },
    { value: 'stanley', viewValue: 'Stanley\'s Command' },
    { value: 'curvature-following', viewValue: 'Curvature Following' }
  ];

  ngOnInit(): void {
    this.selectedStrategy = this.strategies[0].value;
  }

}
