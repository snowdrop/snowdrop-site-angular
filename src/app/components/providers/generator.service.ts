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

	private getGeneratorHeaders() {
		let headers = new Headers();
		return headers;
	}

	private getGitHubHeaders() {
		let headers = new Headers();
		return headers;
	}


	public getGeneratorConfig() {
		return this.http.get(this.serviceURL + "/config", {
			headers: this.getGeneratorHeaders()
		}).toPromise().then((res) => {
			let json = res.json();
			console.log("Generator config", JSON.stringify(json));
			return json;
		}).catch((err) => {
			console.error(err);
			return this.SDFALLBACK;
		});
	}

	public getSnowdropVersions() {
		return this.http.get("https://api.github.com/repos/snowdrop/spring-boot-bom/tags", {
			headers: this.getGitHubHeaders()
		}).toPromise().then((res) => {
			let json = res.json().filter((t) => { return t.name.indexOf("Final") > -1; });
			console.log("Snowdrop versions", JSON.stringify(json));
			return json;
		}).catch((err) => {
			console.error(err);
			return this.SDFALLBACK;
		});
	}

	public getSpringBootVersions() {
		return this.http.get("https://api.github.com/repos/spring-projects/spring-boot/tags", {
			headers: this.getGitHubHeaders()
		}).toPromise().then((res) => {
			let json = res.json()
				.filter((t) => { return t.name.indexOf("RELEASE") > -1; })
				.filter((t) => { return t.name.indexOf("v1") === 0; });
			console.log("Spring boot versions", JSON.stringify(json));
			return json;
		}).catch((err) => {
			console.error(err);
			return this.SBFALLBACK;
		});
	}

	public generate(opts: {
		template?: string
		dependencies?: any
	} = {}) {

		if (!opts.template) {
			opts.template = "simple";
		}

		if (opts.template && opts.template !== "simple") {
			opts.dependencies = undefined;
		}

		let query = "";
		let queryStarted = false;
		for (let key of Object.keys(opts)) {
			let value = opts[key];
			console.log("Key", key, "Value", value);
			if (value && (value.length > 0 || (value.trim && value.trim().length > 0))) {
				if (queryStarted) {
					query += "&";
				} else {
					query += "?";
				}
				if (Array.isArray(value)) {
					for (let i = 0; i < value.length; i++) {
						const v = value[i];
						query += `${key}=${v}`;
						if (i < value.length - 1) {
							query += "&";
						}
					}
				} else {
					query += `${key}=${value}`;
				}
				queryStarted = true;
			}
		}

		let finalURL = `${this.serviceURL}/app` + query;
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

	private SDFALLBACK = JSON.parse(`{"templates":["crud","rest","simple"],"bomversions":[{"community":"1.5.15.RELEASE","snowdrop":"1.5.15.Final","default":true},{"community":"1.5.14.RELEASE","snowdrop":"1.5.14.Final","default":false},{"community":"1.5.13.RELEASE","snowdrop":"1.5.13.Final","default":false}],"modules":[{"name":"core","description":"Core dependencies of a Spring Boot application","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"web","description":"Web","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-web"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"websocket","description":"Websocket full-duplex communication and streaming of messages","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-websocket"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"jaxrs","description":"Apache CXF Starter implementing JAX-RS specification","guide_ref":"","dependencies":[{"groupid":"org.apache.cxf","artifactid":"cxf-spring-boot-starter-jaxrs"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"hibernate","description":"JPA \u0026 ORM with Hibernate","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-data-jpa"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-jdbc"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"monitoring","description":"Monitor and manage your application using Jolokia, Prometheus, ...","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-actuator"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"integration","description":"Apache Camel Routing and Mediation framework","guide_ref":"","dependencies":[{"groupid":"org.apache.camel","artifactid":"camel-spring-boot-starter","version":"2.21.1"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]}]}`);
	private SBFALLBACK = [{ "name": "v1.5.15.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.15.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.15.RELEASE", "commit": { "sha": "aa6a70b06996a1811cf365870002e5fbbac825f0", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/aa6a70b06996a1811cf365870002e5fbbac825f0" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjE1LlJFTEVBU0U=" }, { "name": "v1.5.14.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.14.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.14.RELEASE", "commit": { "sha": "22c07413ead1d12c6cddb42c3ad30f977512a0f9", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/22c07413ead1d12c6cddb42c3ad30f977512a0f9" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjE0LlJFTEVBU0U=" }, { "name": "v1.5.13.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.13.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.13.RELEASE", "commit": { "sha": "5533268f423d472dbc28ce694ccfa10bc1f98ddb", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/5533268f423d472dbc28ce694ccfa10bc1f98ddb" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjEzLlJFTEVBU0U=" }, { "name": "v1.5.12.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.12.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.12.RELEASE", "commit": { "sha": "9ec7fc58ddaf023871a1b22c44c4c2da9e43c40f", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/9ec7fc58ddaf023871a1b22c44c4c2da9e43c40f" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjEyLlJFTEVBU0U=" }, { "name": "v1.5.11.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.11.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.11.RELEASE", "commit": { "sha": "83ff0febd42ea1daff9010426559b52f275ef552", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/83ff0febd42ea1daff9010426559b52f275ef552" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjExLlJFTEVBU0U=" }, { "name": "v1.5.10.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.10.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.10.RELEASE", "commit": { "sha": "541890f0e003a6e346f2234102c97105ab1292ee", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/541890f0e003a6e346f2234102c97105ab1292ee" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjEwLlJFTEVBU0U=" }, { "name": "v1.5.9.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.9.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.9.RELEASE", "commit": { "sha": "1e8b9569d3a3900a0ed61712099823ad735b8078", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/1e8b9569d3a3900a0ed61712099823ad735b8078" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjkuUkVMRUFTRQ==" }, { "name": "v1.5.8.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.8.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.8.RELEASE", "commit": { "sha": "a4ddbcf23147875090f9c3c183a6c28891b7fb10", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/a4ddbcf23147875090f9c3c183a6c28891b7fb10" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjguUkVMRUFTRQ==" }, { "name": "v1.5.7.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.7.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.7.RELEASE", "commit": { "sha": "6ab07f8cf00ad3da1d110f0e5a6defcf872c0883", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/6ab07f8cf00ad3da1d110f0e5a6defcf872c0883" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjcuUkVMRUFTRQ==" }, { "name": "v1.5.6.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.6.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.6.RELEASE", "commit": { "sha": "a5229f24b8239bdeb7ed3edd78a007e37f10b264", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/a5229f24b8239bdeb7ed3edd78a007e37f10b264" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjYuUkVMRUFTRQ==" }, { "name": "v1.5.5.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.5.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.5.RELEASE", "commit": { "sha": "83b5a3bfce2fa49d47c6d20e78946454a6d636b1", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/83b5a3bfce2fa49d47c6d20e78946454a6d636b1" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjUuUkVMRUFTRQ==" }, { "name": "v1.5.4.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.4.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.4.RELEASE", "commit": { "sha": "924aabdad9eb1da7bfe5b075f9befa2d0b2374e8", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/924aabdad9eb1da7bfe5b075f9befa2d0b2374e8" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjQuUkVMRUFTRQ==" }, { "name": "v1.5.3.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.3.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.3.RELEASE", "commit": { "sha": "2f3a12270aa6183c30103adf524bdce967310790", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/2f3a12270aa6183c30103adf524bdce967310790" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjMuUkVMRUFTRQ==" }, { "name": "v1.5.2.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.2.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.2.RELEASE", "commit": { "sha": "cd316e7f3d492201e858c1dd6602a1d4e349f4b2", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/cd316e7f3d492201e858c1dd6602a1d4e349f4b2" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjIuUkVMRUFTRQ==" }];
}
