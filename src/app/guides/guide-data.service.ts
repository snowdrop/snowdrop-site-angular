import {Injectable, OnInit, OnDestroy } from "@angular/core";
import {Http} from '@angular/http';

@Injectable()
export class GuideDataService implements OnInit, OnDestroy {

  constructor(
    private http: Http,
  ) {
  }

  ngOnDestroy() {
  }

  _ready: Promise<void> = null;
  guides: any[];

  ngOnInit(): void {
    this.ready();
  }

  public ready() {
    if(!this._ready) {
      console.log("GuideDataService starting up.");
      this._ready = this.http.get("/src/assets/guides.json").toPromise().then((res)=>{
        console.log("GuideDataService initialized.");
        this.guides = res.json();
      });
    }
    return this._ready;
  }

  public render(guide:any):Promise<string> {
    if(!guide || !guide.url) {
      return Promise.resolve("Guide content could not be rendered.");
    }
    return this.http.get(guide.url).toPromise().then((res)=>{
      return <string>res.text("iso-8859").toString();
    });
  }

  getGuideByTitle(title:string) {
    if(this.guides && title && title.trim().length > 0) {
      title = this.urlify(title);
      for(let guide of this.guides) {
        if(guide && this.urlify(guide.title) === title) {
          return guide;
        }
      }
    }
    return null;
  }

  getGuides() {
    return this.guides;
  }

  getGuideIcon(guide:any) {
    let result = "code";
    if(guide.type === "booster") {
      result = "rocket";
    }
    if(guide.type === "guide") {
      result = "book";
    }
    return result;
  }

  getGuideLabel(guide:any) {
    let result = "Open this guide";
    if(guide.type === "booster") {
      result = "Run this booster";
    }
    return result;
  }

  getGuideURL(guide:any) {
     let result = "guides/" + this.urlify(guide.title);
     if(guide.type === "booster") {
       result = "Run this booster";
     }
     return result;
  }

  getFilteredGuides(filter = "") {
    if(filter && filter.trim().length > 0) {
      let keywords = filter.toLowerCase().split(/\s+/gi);
      return this.guides.filter((guide:any)=>{
        for(let k of keywords) {
          if(!guide || !((guide.description && (guide.description+"").toLowerCase().indexOf(k) >= 0)
            || (guide.title && (guide.title+"").toLowerCase().indexOf(k) >= 0)
            || (guide.keywords && (guide.keywords+"").toLowerCase().indexOf(k) >= 0)
          )) {
            return false;
          }
        }
        return true;
      });
    } else {
      return this.guides;
    }
  }

  private urlify(value:string) {
    if(!value) return value;
    return value.toLowerCase().replace(/[^a-z0-9]/gi,"-");
  }
}
