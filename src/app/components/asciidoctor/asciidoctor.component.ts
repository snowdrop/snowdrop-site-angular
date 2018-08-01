import { Component, Input, OnInit, OnDestroy, ViewChild } from "@angular/core";

declare var Asciidoctor;

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
		this._source = source;
		let render = (retries) => {
			let retry = () => {
				if (retries > 0) {
					console.log(retries, "retries remain.")
					setTimeout(() => {
						render(--retries);
					}, 250);
				}
			}

			try {
				if (Asciidoctor) {
					this.rendered = Asciidoctor().convert(source);
					this.rendered = this.rendered.replace(/<a(?!.*class="anchor"[^>])([^>]+)href\s*=\s*([\"\'])(#[^\'\"]+)([\"\'])/g, `<a$1href=$2${window.location.pathname}$3$4`);
				} else {
					retry();
				}
			} catch (err) {
				console.error("ASCIIDOC FAILED:", err);
			}
		}
		render(25);
	}

	get source() {
		return this._source;
	}

}
