import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { ActivatedRoute } from "@angular/router";

import { NewsDataService } from '../news-data.service';

@Component({
	selector: "news-view",
	templateUrl: "./news-view.component.html",
	styleUrls: ["./news-view.component.scss"]
})
export class NewsViewComponent implements OnInit, OnDestroy {

	constructor(
		private newsService: NewsDataService,
		private route: ActivatedRoute,
		private http: Http,
	) {
		this.route.fragment.subscribe((value) => {
			this.ready().then(() => {
				setTimeout(() => {
					let matches = Array.from(document.querySelectorAll(`a[href="#${value}"]`));
					if (matches) {
						let scrolled = false;
						matches.filter((element) => {
							if (!scrolled) {
								scrolled = true;
								element.scrollIntoView({
									behavior: "smooth",
									block: "start",
								});
							}
						});
					}
				}, 150);
			});
		});
	}

	ngOnDestroy() {
	}

	article: any;
	articleId: string;
	source: string = "Loading...";
	_ready: Promise<any> = null;

	ngOnInit(): void {
		this.ready();
	}

	ready() {
		if (!this._ready) {
			this._ready = new Promise((resolve, reject) => {
				console.log(`Handle route data`);
				this.route.paramMap.subscribe((params) => {
					this.articleId = params.get("articleId");
					return this.newsService.ready().then(() => {
						this.article = this.newsService.getArticleByTitle(this.articleId);
						console.log(`Loading ${this.articleId}`, this.article);
						return this.newsService.render(this.article).then((source) => {
							this.source = source;
						});
					})
				})
			});
		}
		return this._ready;
	}

}
