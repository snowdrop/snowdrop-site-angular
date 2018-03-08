import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Http} from '@angular/http';
import {ActivatedRoute} from "@angular/router";
import {RegistryService} from "../components";

@Component({
  selector: "docs-component",
  templateUrl: "./docs.component.html",
  styleUrls: ["./docs.component.scss"]
})
export class DocsComponent implements OnInit, OnDestroy {

  constructor(
    private registryService: RegistryService,
    private route: ActivatedRoute,
    private http: Http,
  ) {
    this.route.fragment.subscribe((value)=>{
      console.log("Got an anchor change", value);
      this.ready().then(()=>{
        setTimeout(()=>{
          let matches = document.querySelectorAll(`a[href="#${value}"]`);
          if(matches){
            let scrolled = false;
            matches.forEach((element)=>{
              if(!scrolled){
                scrolled = true;
                console.log("Matches",element);
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

  source: string = "Loading...";
  private _ready:Promise<void> = null;

  ngOnInit(): void {
    this.ready();
  }

  private ready() {
    if(!this._ready){
      console.log(`Handle route data`);
      this._ready = new Promise((resolve, reject)=>{
        this.route.paramMap.subscribe((params)=>{
          console.log("Params initialized.", params);
          return this.registryService.getRegistry().then((registry)=>{
            console.log("GuideDataService initialized.");
            let docsUrl = registry.documentation.url;
            return this.http.get(docsUrl).toPromise().then((res)=>{
              this.source = res.text();
              resolve();
            });
          }).catch((err)=>{
            reject(err);
          });
        });
      })
    }
    return this._ready;
  }

}
