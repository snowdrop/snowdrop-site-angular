import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Http} from '@angular/http';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import {CardAction, CardConfig, CardFilter, SparklineConfig, SparklineData} from 'patternfly-ng';

import {GuideDataService} from './guide-data.service';

@Component({
  selector: "guides",
  templateUrl: "./guides.component.html",
  styleUrls: ["./guides.component.scss"]
})
export class GuidesComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private guideService: GuideDataService
  ) {
  }

  ngOnDestroy() {
  }

  actionsText: string = '';
  buffer: CardConfig[];
  guides: CardConfig[];

  ngOnInit(): void {
    this.guideService.ready().then(()=>{
      let guidesConfig = this.guideService.getGuides();
        console.log(guidesConfig);
        this.guides = [];

        for(let guide of guidesConfig) {
          this.guides.push(
          {
            title: guide.title,
            description: guide.description,
            noPadding: false,
            action: {
              hypertext: this.guideService.getGuideLabel(guide),
              url: this.guideService.getGuideURL(guide),
              iconStyleClass: 'fa fa-' + this.guideService.getGuideIcon(guide)
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
          } as CardConfig);
        }

        this.filterGuides();
    });
  }

  filterGuides(filter = "") {
    if(filter && filter.trim().length > 0) {
      let keywords = filter.toLowerCase().split(/\s+/gi);
      this.buffer = this.guides.filter((guide:any)=>{
        for(let k of keywords) {
          if(!((guide.description && (guide.description+"").toLowerCase().indexOf(k) >= 0)
            || (guide.title && (guide.title+"").toLowerCase().indexOf(k) >= 0)
            || (guide.keywords && (guide.keywords+"").toLowerCase().indexOf(k) >= 0)
          )) {
            return false;
          }
        }
        return true;
      });
    } else {
      this.buffer = this.guides;
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
