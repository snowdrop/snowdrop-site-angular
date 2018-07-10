import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { Http } from '@angular/http';
import { RegistryService } from '../components';

@Injectable()
export class NewsDataService implements OnInit, OnDestroy {

	constructor(
		private http: Http,
		private registryService: RegistryService
	) {
	}

	ngOnDestroy() {
	}

	private _ready: Promise<void> = null;
	private news: any[];

	ngOnInit(): void {
		this.ready();
	}

	public ready() {
		if (!this._ready) {
			console.log("NewsDataService starting up.");
			this._ready = this.registryService.getRegistry().then((registry) => {
				console.log("NewsDataService initialized.");
				this.news = registry.news;
			});
		}
		return this._ready;
	}

	public render(article: any): Promise<string> {
		if (!article || !article.url) {
			return Promise.resolve("Article content could not be rendered.");
		}
		return this.http.get(article.url).toPromise().then((res) => {
			return <string>res.text("iso-8859").toString();
		});
	}

	getArticleByTitle(title: string) {
		if (this.news && title && title.trim().length > 0) {
			title = this.urlify(title);
			for (let article of this.news) {
				if (article && this.urlify(article.title) === title) {
					return article;
				}
			}
		}
		return null;
	}

	getArticles() {
		return this.news;
	}

	getArticleIcon(article: any) {
		let result = "code";
		if (article.type === "booster") {
			result = "rocket";
		}
		if (article.type === "article") {
			result = "book";
		}
		return result;
	}

	getArticleLabel(article: any) {
		let result = "Open this article";
		if (article.type === "booster") {
			result = "Download";
		}
		return result;
	}

	getArticleURL(article: any) {
		let result = this.urlify(article.title);
		return result;
	}

	getFilteredArticles(filter = "") {
		if (filter && filter.trim().length > 0) {
			let keywords = filter.toLowerCase().split(/\s+/gi);
			return this.news.filter((article: any) => {
				for (let k of keywords) {
					if (!article || !((article.description && (article.description + "").toLowerCase().indexOf(k) >= 0)
						|| (article.title && (article.title + "").toLowerCase().indexOf(k) >= 0)
						|| (article.keywords && (article.keywords + "").toLowerCase().indexOf(k) >= 0)
					)) {
						return false;
					}
				}
				return true;
			});
		} else {
			return this.news;
		}
	}

	private urlify(value: string) {
		if (!value) return value;
		return value.toLowerCase().replace(/[^a-z0-9]+/gi, "-");
	}
}
