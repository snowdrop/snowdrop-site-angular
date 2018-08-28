import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { Http, Headers } from '@angular/http';

@Injectable()
export class GeneratorService {

	constructor(
		private http: Http,
	) {
	}

	private _ready: Promise<GeneratorService> = null;
	private serviceURL = "http://spring-boot-generator.195.201.87.126.nip.io";

	ngOnInit(): void {
		this.ready();
	}

	public ready() {
		if (!this._ready) {
			console.log("Site configuration starting up.");
			this._ready = Promise.resolve(this);
		}
		return this._ready;
	}

	private getGitHubHeaders() {
		let headers = new Headers();
		headers.append("Authorization", "Token da35844b7325fefb1e879a9b5093c8350521095a");
		headers.append("Content-Type", "application/x-www-form-urlencoded");
		return headers;
	}

	public getSnowdropVersions() {
		return this.http.get("https://api.github.com/repos/snowdrop/spring-boot-bom/tags", {
			headers: this.getGitHubHeaders()
		}).toPromise().then((res) => {
			return res.json().filter((t) => { return t.name.indexOf("Final") > -1; });
		});
	}

	public getSpringBootVersions() {
		return this.http.get("https://api.github.com/repos/spring-projects/spring-boot/tags", {
			headers: this.getGitHubHeaders()
		}).toPromise().then((res) => {
			return res.json()
				.filter((t) => { return t.name.indexOf("RELEASE") > -1; })
				.filter((t) => { return t.name.indexOf("v1") === 0; });
		});
	}

	public generate(opts: {
		template?: string
	} = {}) {

		if (!opts.template) {
			opts.template = "simple";
		}

		let query = "";
		let queryStarted = false;
		for (let key of Object.keys(opts)) {
			let value = opts[key];
			if (value && (value.length > 0 || (value.trim && value.trim().length > 0))) {
				if (queryStarted) {
					query += "&";
				} else {
					query += "?";
				}
				if (Array.isArray(value)) {
					query += `${key}=` + value.join(",");
				} else {
					query += `${key}=${value}`;
				}
				queryStarted = true;
			}
		}

		let finalURL = `${this.serviceURL}/template/${opts.template}` + query;
		console.log("Generator URL", finalURL);
		window.open(finalURL, "_blank");

		// http://spring-boot-generator.195.201.87.126.nip.io/template/simple
		// ?artifactId=ocool
		// &bomVersion=1.5.15.Final
		// &dependencies=web
		// &groupId=org.acme.cool
		// &outDir=&packageName=me.snowdrop.cool
		// &springbootVersion=1.5.15.RELEASE
		// &version=1.0.0
	}
}
