import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Http} from '@angular/http';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import * as asciidoctor from "asciidoctor.js";

import {CardAction, CardConfig, CardFilter, SparklineConfig, SparklineData} from 'patternfly-ng';

import {GuideDataService} from '../guide-data.service';

@Component({
  selector: "guide-view",
  templateUrl: "./guide-view.component.html",
  styleUrls: ["./guide-view.component.scss"]
})
export class GuideViewComponent implements OnInit, OnDestroy {

  constructor(
    private guideService: GuideDataService,
    private route: ActivatedRoute,
    private http: Http,
  ) {
  }

  ngOnDestroy() {
  }

  guide: any;
  guideId: string;
  source: string = "Loading...";

  ngOnInit(): void {
    console.log(`Handle route data`);
    this.route.paramMap.subscribe((params)=>{
      this.guideId = params.get("guideId");
      this.guideService.ready().then(()=>{
        this.guide = this.guideService.getGuideByTitle(this.guideId);
        console.log(`Loading ${this.guideId}`, this.guide);
        this.guideService.render(this.guide).then((source)=>{
          this.source = asciidoctor().convert(source);
        });
      })
    })
  }

}
