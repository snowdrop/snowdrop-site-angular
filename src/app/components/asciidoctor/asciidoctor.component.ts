import {Component, Input, OnInit, OnDestroy, ViewChild} from "@angular/core";
import * as asciidoctor from "asciidoctor.js";

@Component({
  selector: "asciidoctor",
  templateUrl: "./asciidoctor.component.html",
  styleUrls: ["./asciidoctor.component.scss"]
})
export class AsciidoctorComponent implements OnInit, OnDestroy {

  constructor(
  ) {
  }

  ngOnDestroy() {
  }

  _source:string = null;
  rendered: string = "Loading...";

  ngOnInit(): void {
  }

  @Input("source")
  set source(source:string) {
    this._source = source;
    this.rendered = asciidoctor().convert(source);
    let prefix = window.location.pathname;
    this.rendered = this.rendered.replace(/<a(?!.*class="anchor"[^>])([^>]+)href\s*=\s*([\"\'])(#[^\'\"]+)([\"\'])/g,`<a$1href=$2${prefix}$3$4`)
  }

  get source() {
    return this._source;
  }

}
