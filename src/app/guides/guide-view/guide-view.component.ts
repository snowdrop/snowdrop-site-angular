import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Http} from '@angular/http';
import {ActivatedRoute} from "@angular/router";

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
      this.route.fragment.subscribe((value)=>{
        this.ready().then(()=>{
          setTimeout(()=>{
            let matches = document.querySelectorAll(`a[href="#${value}"]`);
            if(matches){
              let scrolled = false;
              matches.forEach((element)=>{
                if(!scrolled){
                  scrolled = true;
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              });
            }
          }, 150);
        });
      });
  }

  ngOnDestroy() {
  }

  guide: any;
  guideId: string;
  source: string = "Loading...";
  _ready:Promise<void> = null;

  ngOnInit(): void {
    this.ready();
  }

  ready() {
    if(!this._ready) {
      this._ready = new Promise((resolve, reject)=>{
        console.log(`Handle route data`);
        this.route.paramMap.subscribe((params)=>{
          this.guideId = params.get("guideId");
          return this.guideService.ready().then(()=>{
            this.guide = this.guideService.getGuideByTitle(this.guideId);
            console.log(`Loading ${this.guideId}`, this.guide);
            return this.guideService.render(this.guide).then((source)=>{
              this.source = source;
            });
          })
        })
      });
    }
    return this._ready;
  }

}
