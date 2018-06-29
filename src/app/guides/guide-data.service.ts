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
	private registry: any;

	ngOnInit(): void {
		this.ready();
	}

	public ready() {
		if (!this._ready) {
			console.log("GuideDataService starting up.");
			this._ready = this.registryService.getRegistry().then((registry) => {
				console.log("GuideDataService initialized.");
				this.registry = registry;
				this.getGuides();
			});
		}
		return this._ready;
	}

	public render(guide: any): Promise<string> {
		if (!guide || !guide.urls.content) {
			return Promise.resolve("Guide content could not be rendered.");
		}
		return this.http.get(guide.urls.content).toPromise().then((res) => {
			return <string>res.text("iso-8859").toString();
		});
	}

	public getGuideByTitle(title: string) {
		if (this.guides && title && title.trim().length > 0) {
			title = this.urlify(title);
			for (let guide of this.getGuides()) {
				if (guide && this.urlify(guide.title) === title) {
					return guide;
				}
			}
		}
		return null;
	}

	public getGuides() {
		if (!this.guides) {
			let result = [];
			let notNullOrEmpty = (value) => {
				return value && value.trim() !== 0;
			};

			if (this.registry) {
				for (let guide of this.registry.guides) {
					let g: any = {
						title: guide.title,
						type: guide.type,
						description: guide.description,
						urls: {
							local: this.urlify(guide.title),
							content: this.registryService.getDefaultValue([guide.type, "urls", "content"])
						},
						tags: this.getGuideTags(guide, "tags"),
						prerequisites: this.getGuideTags(guide, "prerequisites"),
						enablements: this.getGuideTags(guide, "enablements")
					}
					if (guide.urls) {
						let urls = guide.urls;
						if (notNullOrEmpty(urls.booster)) {
							g.urls.booster = this.helper.getBackendUrl() + "launcher/zip?" + guide.urls.booster;
						}
						if (notNullOrEmpty(urls.source)) {
							g.urls.source = urls.source.trim();
						}
						if (notNullOrEmpty(urls.documentation)) {
							g.urls.documentation = urls.documentation.trim();
						}
						if (notNullOrEmpty(urls.content)) {
							g.urls.content = urls.content.trim();
						}
					}
					result.push(g);
				}
			}
			this.guides = result;
		}

		return this.guides;
	}


	public getGuideEnablements(guide: any) {
		return this.getRelatedGuides(guide, "enablements");
	}

	public getGuidePrerequisites(guide: any) {
		return this.getRelatedGuides(guide, "prerequisites");
	}

	public getRelatedGuides(guide: any, type?: string) {
		let guides = this.getGuides();
		let related = [];
		if (type) {
			let guides = this.getGuides();
			let prereqs = [];
			if (guide && guide[type]) {
				prereqs = guides.filter((g) => {
					let matched = false;
					for (let p of guide[type]) {
						let include = true;
						if (p.indexOf("-") === 0) {
							include = false;
							p = p.substr(1, p.length - 1);
						}
						if (g.tags && g.tags.indexOf(p) >= 0) {
							if (include) {
								matched = true;
							} else {
								return false;
							}
						}
					}
					return matched;
				});
			}
			return prereqs;
		} else {
			if (guide && guide.tags) {
				related = guides.filter((g) => {
					for (let t of g.tags) {
						if (guide.tags && guide.tags.indexOf(t) >= 0)
							return guide.title !== g.title;
					}
					return false;
				});
			}
		}
		return related;
	}

	private getGuideIcon(guide: any) {
		let result = "code";
		if (guide && guide.type === "booster") {
			result = "rocket";
		}
		if (guide && guide.type === "guide") {
			result = "book";
		}
		return result;
	}

	private getGuideLabel(guide: any) {
		let result = "Read guide";
		if (guide && guide.type === "booster") {
			result = "Download";
		}
		return result;
	}

	private getGuideTags(guide: any, prop: string) {
		let result = [];
		if (guide && guide.tags && prop) {
			let tags = guide[prop.trim()];
			if (tags) {
				result = tags.toLowerCase().split(",").map(t => t.trim());
			}
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
		return value.toLowerCase().replace(/[^a-z0-9]/gi, "-").replace("-+", "-");
	}
}
