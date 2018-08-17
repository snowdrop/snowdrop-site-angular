import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

declare var Asciidoctor;

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: "asciidoctor",
	templateUrl: "./asciidoctor.component.html",
	styleUrls: ["./asciidoctor.component.scss"]
})
export class AsciidoctorComponent implements OnInit, OnDestroy {

	@Input("toc")
	private toc: boolean = false;

	@Output()
	error: EventEmitter<AsciidoctorComponent> = new EventEmitter();

	@Output()
	loaded: EventEmitter<AsciidoctorComponent> = new EventEmitter();

	constructor(
		private sanitizer: DomSanitizer
	) {
	}

	ngOnDestroy() {
	}

	_source: string = null;
	rendered: SafeHtml = null;

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
					let html = "";
					if (!this.toc) {
						html = Asciidoctor().convert(source).replace(/<a(?!.*class="anchor"[^>])([^>]+)href\s*=\s*([\"\'])(#[^\'\"]+)([\"\'])/g, `<a$1href=$2${window.location.pathname}$3$4`);
						html = html.replace(/<div([^>]+)class="sect2([^"]*)"([^>]*)>/g, `<div$1class="sect2$2 expandable"$3>`);
						this.loaded.emit(this);
					} else {
						if (source.toLowerCase().indexOf(":toc:") == -1) {
							source = `:toc:\n` + source;
						}
						html = Asciidoctor().convert(source).replace(/<a(?!.*class="anchor"[^>])([^>]+)href\s*=\s*([\"\'])(#[^\'\"]+)([\"\'])/g, `<a$1href=$2${window.location.pathname}$3$4`);
						const div = document.createElement("div");
						div.innerHTML = html;
						const tocElements = div.getElementsByClassName("toc");
						if (tocElements.length) {
							const toc = tocElements.item(0);
							const tocHtml = toc.outerHTML.replace(/<div[^>]*id="toctitle"[^>]*>[^<]*<\/div>/, "");
							html = tocHtml;
							this.loaded.emit(this);
						} else {
							html = "No table of contents.";
							this.error.emit(this);
						}
					}
					this.rendered = this.sanitizer.bypassSecurityTrustHtml(html);
				} else {
					retry();
				}
			} catch (err) {
				console.error("ASCIIDOC FAILED:", err);
				this.error.emit(this);
			}
		}
		render(25);
	}

	get source() {
		return this._source;
	}

}
