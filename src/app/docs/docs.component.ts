import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Http} from '@angular/http';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "docs-component",
  templateUrl: "./docs.component.html",
  styleUrls: ["./docs.component.scss"]
})
export class DocsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private http: Http,
  ) {
  }

  ngOnDestroy() {
  }

  source: string = "Loading...";

  ngOnInit(): void {
    console.log(`Handle route data`);
    this.route.paramMap.subscribe((params)=>{
      this.http.get("https://raw.githubusercontent.com/snowdrop/site/master/documentation.adoc").toPromise().then((res)=>{
        this.source = res.text();
      });
    });
  }

}
