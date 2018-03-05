import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import {CardAction, CardConfig, CardFilter, SparklineConfig, SparklineData} from 'patternfly-ng';

@Component({
  selector: "guides",
  templateUrl: "./guides.component.html",
  styleUrls: ["./guides.component.scss"]
})
export class GuidesComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute) {
  }

  ngOnDestroy() {
  }


  actionsText: string = '';
  chartDates: any[] = ['dates'];
  chartConfig: SparklineConfig = {
    chartHeight: 60,
    chartId: 'exampleSparkline',
    tooltipType: 'default'
  };
  chartData: SparklineData = {
    dataAvailable: true,
    total: 100,
    xData: this.chartDates,
    yData: ['used', 10, 20, 30, 20, 30, 10, 14, 20, 25, 68, 54, 56, 78, 56, 67, 88, 76, 65, 87, 76]
  };
  config: CardConfig;

  ngOnInit(): void {
    this.config = {
      title: 'HTTP API',
      action: {
        hypertext: 'Get the code',
        url: "https://github.com/snowdrop/spring-boot-http-booster",
        iconStyleClass: 'fa fa-code'
      },
      filters: [{
        title: 'Version 1.4.7',
        value: '30'
      }, {
        default: true,
        title: 'Version 1.5.0',
        value: '15'
      }, {
        title: 'Today',
        value: 'today'
      }],
    } as CardConfig;

    let today = new Date();
    for (let d = 20 - 1; d >= 0; d--) {
      this.chartDates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
    }
  }

  // Actions

  handleActionSelect($event: CardAction): void {
    this.actionsText = $event.hypertext + ' selected\r\n' + this.actionsText;
  }

  handleFilterSelect($event: CardFilter): void {
    this.actionsText = $event.title + ' selected\r\n' + this.actionsText;
  }

}
