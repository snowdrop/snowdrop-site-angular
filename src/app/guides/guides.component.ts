import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { GuideDataService } from './guide-data.service';

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
	buffer: any[];
	guides: any[];

	ngOnInit(): void {
		this.guideService.ready().then(() => {
			let guidesConfig = this.guideService.getGuides();
			console.log(guidesConfig);
			this.guides = [];

			for (let guide of guidesConfig) {
				this.guides.push(
					{
						title: guide.title,
						description: guide.description,
						action: {
							label: this.guideService.getGuideLabel(guide),
							url: this.guideService.getGuideURL(guide),
							iconClass: 'fa fa-' + this.guideService.getGuideIcon(guide)
						}
					});
			}

			this.filterGuides();
		});
	}

	filterGuides(filter = "") {
		if (filter && filter.trim().length > 0) {
			let keywords = filter.toLowerCase().split(/\s+/gi);
			this.buffer = this.guides.filter((guide: any) => {
				for (let k of keywords) {
					if (!((guide.description && (guide.description + "").toLowerCase().indexOf(k) >= 0)
						|| (guide.title && (guide.title + "").toLowerCase().indexOf(k) >= 0)
						|| (guide.keywords && (guide.keywords + "").toLowerCase().indexOf(k) >= 0)
					)) {
						return false;
					}
				}
				return true;
			});
		} else {
			this.buffer = this.guides;
		}
	}

}
