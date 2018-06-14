import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { Http } from '@angular/http';
import { RegistryService } from '../components';
import { HelperService } from "ngx-forge";

@Injectable()
export class GuideDataService implements OnInit, OnDestroy {

	constructor(
		private helper: HelperService,
		private http: Http,
		private registryService: RegistryService
	) {
	}

	ngOnDestroy() {
	}

	private _ready: Promise<void> = null;
	private guides: any[];

	ngOnInit(): void {
		this.ready();
	}

	public ready() {
		if (!this._ready) {
			console.log("GuideDataService starting up.");
			this._ready = this.registryService.getRegistry().then((registry) => {
				console.log("GuideDataService initialized.");
				this.guides = registry.guides;
			});
		}
		return this._ready;
	}

	public render(guide: any): Promise<string> {
		if (!guide || !guide.url) {
			return Promise.resolve("Guide content could not be rendered.");
		}
		return this.http.get(guide.url).toPromise().then((res) => {
			return <string>res.text("iso-8859").toString();
		});
	}

	getGuideByTitle(title: string) {
		if (this.guides && title && title.trim().length > 0) {
			title = this.urlify(title);
			for (let guide of this.guides) {
				if (guide && this.urlify(guide.title) === title) {
					return guide;
				}
			}
		}
		return null;
	}

	getGuides() {
		return this.guides;
	}

	getGuideIcon(guide: any) {
		let result = "code";
		if (guide.type === "booster") {
			result = "rocket";
		}
		if (guide.type === "guide") {
			result = "book";
		}
		return result;
	}

	getGuideLabel(guide: any) {
		let result = "Open this guide";
		if (guide.type === "booster") {
			result = "Download";
		}
		return result;
	}

	getGuideURL(guide: any) {
		let result = this.urlify(guide.title);
		if (guide.type === "booster") {
			result = this.helper.getBackendUrl() + "launcher/zip?" + guide.url;
		}
		return result;
	}

	getFilteredGuides(filter = "") {
		if (filter && filter.trim().length > 0) {
			let keywords = filter.toLowerCase().split(/\s+/gi);
			return this.guides.filter((guide: any) => {
				for (let k of keywords) {
					if (!guide || !((guide.description && (guide.description + "").toLowerCase().indexOf(k) >= 0)
						|| (guide.title && (guide.title + "").toLowerCase().indexOf(k) >= 0)
						|| (guide.keywords && (guide.keywords + "").toLowerCase().indexOf(k) >= 0)
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

	private urlify(value: string) {
		if (!value) return value;
		return value.toLowerCase().replace(/[^a-z0-9]/gi, "-");
	}
}
