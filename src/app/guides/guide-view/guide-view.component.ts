import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
		private _sanitizer: DomSanitizer,
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
						if (element.parentElement.classList.contains("expandable")) {
							element.parentElement.classList.add("expand");
						}
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

	katacodaHTML = null;

	ready() {
		if (!this._ready) {
			this._ready = new Promise((resolve, reject) => {
				console.log(`Handle route data`);
				this.route.paramMap.subscribe((params) => {
					this.guideId = params.get("guideId");
					return this.guideService.ready().then(() => {
						this.guide = this.guideService.getGuideByTitle(this.guideId);

						// this.guide.urls.katacoda = "openshift/courses/introduction/developing-with-odo";
						// this.guide.urls.katacodaCover = "http://snowdrop.me/guides";
						//
						if (this.guide.urls.katacoda)
							this.katacodaHTML = this._sanitizer.bypassSecurityTrustHtml(`
							<script src="//katacoda.com/embed.js"></script>
							<div id="katacoda-scenario-1"
							data-katacoda-id="${this.guide.urls.katacoda}"
							data-katacoda-ctatext="More Scenarios"
							${this.guide.urls.katacodaCover ? 'data-katacoda-ctaurl="' + this.guide.urls.katacodaCover : '"'}
							data-katacoda-color="1a1a1a"
							data-katacoda-secondary="cc0000"
							data-katacoda-font="Open Sans"
							data-katacoda-fontheader="Open Sans"
							style="height: calc(100vh - 130px);">
						</div>`);

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


	attachCollapseHandlers() {
		const sections = document.getElementsByClassName("sect2");
		console.log("Attaching collapse handlers", sections);

		const removeLinks = (parent: Element) => {
			const nodes = parent.childNodes;
			if (nodes && nodes.length) {
				for (let i = 0; i < nodes.length; i++) {
					const child = nodes.item(i);
					console.log("Removing links from section header", i);
					if (child.nodeName.match(/H\d/i)) {
						(<Element>child).innerHTML = child.textContent;
						return;
					}
				}
			}
		}

		/*
		 * WARNING:This method applies a good amount of DOM manipulation magic to:
		 *
	   * 1. Ensure that links do not appear in headers (causing external page loads)
		 * 2. Attach click event listeners to handle collapse/expand functionality
		 * 3. Change styles on section headers in the DOM to perform collapse/expand
		 */
		for (let i = 0; i < sections.length; i++) {
			const section = sections[i];
			console.log("Adding click handler to section", i);
			/* 1. */ removeLinks(section);
			/* 2. */ section.children.item(0).addEventListener("click", (event: Event) => {
				if (section.classList.contains("expand")) {
					/* 3. */ section.classList.remove("expand");
				} else {
					/* 3. */ section.classList.add("expand");
				}
				console.log("Toggled section", section.classList.toString(), section);
			});
		}
	}

	showToc(enabled) {
		this.displayToc = enabled;
	}

	goTop() {
		window.scrollTo(0, 0);
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
