import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { Http } from '@angular/http';

@Injectable()
export class RegistryService {

	constructor(
		private http: Http,
	) {
	}

	private _ready: Promise<void> = null;
	private registry: any;

	ngOnInit(): void {
		this.ready();
	}

	public ready() {
		if (!this._ready) {
			console.log("Site configuration starting up.");
			this._ready = this.http.get("https://raw.githubusercontent.com/snowdrop/snowdrop-docs/master/site/config.json").toPromise().then((res) => {
				console.log("Site configured.");
				this.registry = res.json();
			}).catch((err) => {
				console.error("Could not load site configuration", err);
			});
		}
		return this._ready;
	}

	public getRegistry() {
		return this.ready().then(() => {
			return this.registry;
		});
	}

	public getDefaultValue(path: string[]) {
		let base = this.registry.defaults;
		if (path && path.length > 0) {
			for (let seg of path) {
				base = base[seg];
				if (!base) {
					break;
				}
			}
		}
		return base;
	}
}
