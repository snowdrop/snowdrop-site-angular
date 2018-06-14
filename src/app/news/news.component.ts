import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { NewsDataService } from './news-data.service';

@Component({
	selector: "news",
	templateUrl: "./news.component.html",
	styleUrls: ["./news.component.scss"]
})
export class NewsComponent implements OnInit, OnDestroy {

	constructor(
		private route: ActivatedRoute,
		private http: Http,
		private newsService: NewsDataService
	) {
	}

	ngOnDestroy() {
	}

	actionsText: string = '';
	buffer: any[];
	news: any[];

	ngOnInit(): void {
		this.newsService.ready().then(() => {
			let articles = this.newsService.getArticles();
			console.log(articles);
			this.news = [];

			for (let news of articles) {
				this.news.push(
					{
						title: news.title,
						description: news.description,
						author: news.author,
						published: news.published,
						tags: news.tags,
						label: this.newsService.getArticleLabel(news),
						url: this.newsService.getArticleURL(news),
					});
			}

			this.filterNews();
		});
	}

	filterNews(filter = "") {
		if (filter && filter.trim().length > 0) {
			let keywords = filter.toLowerCase().split(/\s+/gi);
			this.buffer = this.news.filter((news: any) => {
				for (let k of keywords) {
					if (!((news.description && (news.description + "").toLowerCase().indexOf(k) >= 0)
						|| (news.title && (news.title + "").toLowerCase().indexOf(k) >= 0)
						|| (news.tags && (news.tags + "").toLowerCase().indexOf(k) >= 0)
						|| (news.author && (news.author + "").toLowerCase().indexOf(k) >= 0)
						|| (news.keywords && (news.keywords + "").toLowerCase().indexOf(k) >= 0)
					)) {
						return false;
					}
				}
				return true;
			});
		} else {
			this.buffer = this.news;
		}
	}

}
