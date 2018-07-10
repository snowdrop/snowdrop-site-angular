import { Component, Input, OnInit, OnDestroy, ViewChild } from "@angular/core";

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

	_source: string = null;
	rendered: string = "Loading...";

	ngOnInit(): void {
	}

	@Input("source")
	set source(source: string) {
		let asciidoctor = require('asciidoctor.js');
		this._source = source;
		let retries = 100;
		let render = () => {
			try {
				this.rendered = asciidoctor().convert(source);
				this.rendered = this.rendered.replace(/<a(?!.*class="anchor"[^>])([^>]+)href\s*=\s*([\"\'])(#[^\'\"]+)([\"\'])/g, `<a$1href=$2${window.location.pathname}$3$4`);
			} catch (err) {
				console.error("ASCIIDOC FAILED:", err);
				if (retries > 0) {
					retries--;
					setTimeout(render, 250);
				}
			}
		}
		render();
	}

	get source() {
		return this._source;
	}

}
