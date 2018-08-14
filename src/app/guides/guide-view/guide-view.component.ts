import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { ActivatedRoute } from "@angular/router";

import { GuideDataService, ProjectDataService, TagService } from '../../components/providers';

@Component({
	selector: "guide-view",
	templateUrl: "./guide-view.component.html",
	styleUrls: ["./guide-view.component.scss"]
})
export class GuideViewComponent implements OnInit, OnDestroy {

	relatedGuides: any[] = [];
	relatedProjects: any[] = [];
	prerequisites: any[] = [];
	enablements: any[] = [];

	constructor(
		private guideService: GuideDataService,
		private projectService: ProjectDataService,
		public tags: TagService,
		private route: ActivatedRoute,
		private http: Http,
	) {
		this.route.fragment.subscribe((value) => {
			console.log("Fragment changed", value);
			this.ready().then(() => {
				setTimeout(() => {
					const element = this.getElementByFragment(value);
					if (element) {
						element.scrollIntoView({
							behavior: "auto",
							block: "start",
						});
					}
				}, 150);
			});
		});
	}

	getElementByFragment(fragment) {
		if (fragment) {
			fragment = fragment.replace(/^\s*#/, "");
			let matches = Array.from(document.querySelectorAll(`a[href="#${fragment}"],h1,h2,h3,h4,h5,h6`));
			if (matches) {
				for (let element of matches) {
					if (element.id === fragment) {
						return element;
					}
					if (element.innerHTML) {
						const innerHTML = "_" + element.innerHTML.toLowerCase().trim().replace(/\W+/g, "_");
						if (innerHTML === fragment.toLowerCase()) {
							return element;
						}
					}
				}
			}
		}
	}

	ngOnDestroy() {
		window.removeEventListener("scroll", this.handler);
	}

	displayToc = false;
	guide: any;
	guideId: string;
	source: string = "";
	_ready: Promise<any> = null;

	ngOnInit(): void {
		window.addEventListener("scroll", this.handler);

		this.ready();
	}

	ready() {
		if (!this._ready) {
			this._ready = new Promise((resolve, reject) => {
				console.log(`Handle route data`);
				this.route.paramMap.subscribe((params) => {
					this.guideId = params.get("guideId");
					return this.guideService.ready().then(() => {
						this.guide = this.guideService.getGuideByTitle(this.guideId);
						console.log(`Loading ${this.guideId}`, this.guide);
						this.relatedGuides = this.guideService.getRelatedGuides(this.guide);
						this.relatedProjects = this.guideService.getRelatedProjects(this.guide);
						this.prerequisites = this.guideService.getGuidePrerequisites(this.guide);
						this.enablements = this.guideService.getGuideEnablements(this.guide);
						return this.guideService.render(this.guide).then((source) => {
							console.log(this.guide, source);
							this.source = source;
							resolve();
						});
					}).catch(reject);
				});
			});
		}
		return this._ready;
	}

	showToc(enabled) {
		this.displayToc = enabled;
	}

	private handler = this.throttle((event) => {
		const fromTop = window.scrollY;
		const links = Array.from(document.querySelectorAll(`.toc a`)) || [];

		for (const link of links) {
			let header = this.getElementByFragment((<any>link).hash);
			if (header && header.parentElement) {
				const section = header.parentElement;
				const rect = section.getBoundingClientRect();
				if (
					rect.top <= 1 &&
					rect.bottom > 0
				) {
					link.classList.add("current");
				} else {
					link.classList.remove("current");
				}
			}
		}
	}, 100);

	throttle(func, limit: number) {
		let lastFunc;
		let lastRan;
		return function() {
			const context = this
			const args = arguments
			if (!lastRan) {
				func.apply(context, args)
				lastRan = Date.now()
			} else {
				clearTimeout(lastFunc)
				lastFunc = setTimeout(function() {
					if ((Date.now() - lastRan) >= limit) {
						func.apply(context, args)
						lastRan = Date.now()
					}
				}, limit - (Date.now() - lastRan))
			}
		}
	}
}
