import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { RegistryService } from './registry.service';
import { ProjectDataService } from './project-data.service';

@Injectable()
export class GuideDataService implements OnInit, OnDestroy {

	constructor(
		private http: Http,
		private projectService: ProjectDataService,
		private registryService: RegistryService
	) {
	}

	ngOnDestroy() {
	}

	private _ready: Promise<void> = null;
	private categories: any[];
	private guides: any[];
	private registry: any;

	ngOnInit(): void {
		this.ready();
	}

	getBackendUrl() {
		return (process.env.LAUNCHER_BACKEND_URL ? Location.stripTrailingSlash(process.env.LAUNCHER_BACKEND_URL) : "") + "/";
	}

	public ready() {
		if (!this._ready) {
			console.log("GuideDataService starting up.");
			this._ready = this.registryService.getRegistry().then((registry) => {
				return this.projectService.ready().then(() => {
					console.log("GuideDataService initialized.");
					this.registry = registry;
					this.getGuides();
				});
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


	public getCategories() {
		if (!this.categories) {
			let result = [];
			let notNullOrEmpty = (value) => {
				return value && value.trim() !== 0;
			};

			if (this.registry) {
				for (let category of this.registry.categories) {
					let c: any = {
						name: category.name,
						description: category.description,
						tags: this.getGuideTags(category, "tags"),
					}
					result.push(c);
				}
			}
			this.categories = result;
		}

		return this.categories;
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
		if (!this.registry) return [];
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
							g.urls.booster = this.getBackendUrl() + "launcher/zip?" + guide.urls.booster;
						}
						if (notNullOrEmpty(urls.katacoda)) {
							g.urls.katacoda = urls.katacoda.trim();
						}
						if (notNullOrEmpty(urls.generator)) {
							g.urls.generator = urls.generator.trim();
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
			if (guide && guide[type]) {
				related = guides.filter((g) => {
					let matched = false;
					for (let relatedTag of guide[type]) {
						let exclude = false;
						let required = false;
						if (g.tags && (g.tags.indexOf("internal") >= 0)) {
							return false;
						} else if (relatedTag.indexOf("-") === 0) {
							exclude = true;
							relatedTag = relatedTag.substr(1, relatedTag.length - 1);
						} else if (relatedTag.indexOf("+") === 0) {
							required = true;
							relatedTag = relatedTag.substr(1, relatedTag.length - 1);
						}

						if (g.tags && g.tags.indexOf(relatedTag) >= 0) {
							if (exclude) {
								return false;
							} else {
								matched = (guide.title !== g.title);
							}
						} else if (required) {
							console.log(`Required tag [${relatedTag}] not found in Guide [${g.title}]`)
							return false;
						}
					}
					return matched;
				});
			}
		} else {
			if (guide && guide.tags) {
				related = guides.filter((g) => {
					for (let t of g.tags) {
						if (guide.tags && guide.tags.indexOf(t) >= 0)
							return (guide.title !== g.title) &&
								(!g.tags || (g.tags.indexOf("hidden") === -1));
					}
					return false;
				});
			}
		}
		return related;
	}

	public getRelatedProjects(guide: any) {
		let projects = this.projectService.getProjects();
		let related = [];
		if (guide && guide.tags) {
			related = projects.filter((p) => {
				return guide.tags && guide.tags.indexOf(p.tag) >= 0;
			});
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
		return value.toLowerCase().replace(/[^a-z0-9]+/gi, "-");
	}
}
