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
			this.guides = this.guideService.getGuides();

			console.log(this.guides);

			this.filterGuides();
		});
	}

	filterGuides(filter = "") {
		let keywords = filter.toLowerCase().split(/\s+/gi);
		this.buffer = this.guides.filter((guide: any) => {
			console.log(guide.title, guide.tags)
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
