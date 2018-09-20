import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { GuideDataService } from '../components/providers';

@Component({
	selector: "guides",
	templateUrl: "./guides.component.html",
	styleUrls: ["./guides.component.scss"]
})
export class GuidesComponent implements OnInit, OnDestroy {

	constructor(
		private route: ActivatedRoute,
		private http: Http,
		private guideService: GuideDataService
	) {
	}

	ngOnDestroy() {
	}

	actionsText: string = '';
	filterText: string = ''
	categories: any[];

	ngOnInit(): void {
		this.guideService.ready().then(() => {
			this.categories = this.guideService.getCategories();

			this.route.queryParamMap.subscribe((params) => {
				if (params.get("t")) {
					this.filterText = params.get("t");
				}
			});
		});
	}

	getCategoryGuides(category) {
		return this.filterGuides(this.guideService.getRelatedGuides(category));
	}

	getOtherGuides() {
		return this.filterGuides(this.guideService.getGuides().filter((g) => {
			return !this.guideIsCategorized(g);
		}));
	}

	categoryHasGuides(category) {
		return this.getCategoryGuides(category).length > 0;
	}

	guideIsCategorized(guide) {
		if (guide) {
			if (this.categories) {
				for (let c of this.categories) {
					for (let g of this.getCategoryGuides(c)) {
						if (g.title === guide.title) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	setFilter(term) {
		this.filterText = term;
	}

	filterGuides(guides?) {
		if (!guides) return [];
		let filter = this.filterText || "";
		let keywords = filter.toLowerCase().split(/\W+/gi);
		return guides.filter((guide: any) => {
			if (guide.tags && (guide.tags + "").toLowerCase().indexOf("hidden") >= 0) {
				return false;
			}
			for (let k of keywords) {
				if (!((guide.description && (guide.description + "").toLowerCase().indexOf(k) >= 0)
					|| (guide.title && (guide.title + "").toLowerCase().indexOf(k) >= 0)
					|| (guide.tags && (guide.tags + "").toLowerCase().indexOf(k) >= 0)
					|| (guide.keywords && (guide.keywords + "").toLowerCase().indexOf(k) >= 0)
				)) {
					return false;
				}
			}
			return true;
		});
	}

}
