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
		return headers;
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

	private SDFALLBACK = [{ "name": "1.5.15.Final", "zipball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/zipball/1.5.15.Final", "tarball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/tarball/1.5.15.Final", "commit": { "sha": "58b10a5ba5fe4814b7cadcbdfe6a5d0fcc91cd5a", "url": "https://api.github.com/repos/snowdrop/spring-boot-bom/commits/58b10a5ba5fe4814b7cadcbdfe6a5d0fcc91cd5a" }, "node_id": "MDM6UmVmODM0NDEzNzc6MS41LjE1LkZpbmFs" }, { "name": "1.5.14.Final", "zipball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/zipball/1.5.14.Final", "tarball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/tarball/1.5.14.Final", "commit": { "sha": "df6d675316e181742a35c06ec66ba69aa8020297", "url": "https://api.github.com/repos/snowdrop/spring-boot-bom/commits/df6d675316e181742a35c06ec66ba69aa8020297" }, "node_id": "MDM6UmVmODM0NDEzNzc6MS41LjE0LkZpbmFs" }, { "name": "1.5.13.Final", "zipball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/zipball/1.5.13.Final", "tarball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/tarball/1.5.13.Final", "commit": { "sha": "ba3ffe401a45e93b6ee336f51b73148a2908c6d7", "url": "https://api.github.com/repos/snowdrop/spring-boot-bom/commits/ba3ffe401a45e93b6ee336f51b73148a2908c6d7" }, "node_id": "MDM6UmVmODM0NDEzNzc6MS41LjEzLkZpbmFs" }, { "name": "1.5.12.Final", "zipball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/zipball/1.5.12.Final", "tarball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/tarball/1.5.12.Final", "commit": { "sha": "7957a4b8dc372576d749cb8e7c245af1dc7c880b", "url": "https://api.github.com/repos/snowdrop/spring-boot-bom/commits/7957a4b8dc372576d749cb8e7c245af1dc7c880b" }, "node_id": "MDM6UmVmODM0NDEzNzc6MS41LjEyLkZpbmFs" }, { "name": "1.5.10.Final", "zipball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/zipball/1.5.10.Final", "tarball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/tarball/1.5.10.Final", "commit": { "sha": "ddcda0e7f53b0acb74e33c1c90157470ff582be3", "url": "https://api.github.com/repos/snowdrop/spring-boot-bom/commits/ddcda0e7f53b0acb74e33c1c90157470ff582be3" }, "node_id": "MDM6UmVmODM0NDEzNzc6MS41LjEwLkZpbmFs" }, { "name": "1.5.8.Final", "zipball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/zipball/1.5.8.Final", "tarball_url": "https://api.github.com/repos/snowdrop/spring-boot-bom/tarball/1.5.8.Final", "commit": { "sha": "efff70e3c6813c26dd07f7ebf520afd1e420d568", "url": "https://api.github.com/repos/snowdrop/spring-boot-bom/commits/efff70e3c6813c26dd07f7ebf520afd1e420d568" }, "node_id": "MDM6UmVmODM0NDEzNzc6MS41LjguRmluYWw=" }];
	private SBFALLBACK = [{ "name": "v1.5.15.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.15.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.15.RELEASE", "commit": { "sha": "aa6a70b06996a1811cf365870002e5fbbac825f0", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/aa6a70b06996a1811cf365870002e5fbbac825f0" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjE1LlJFTEVBU0U=" }, { "name": "v1.5.14.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.14.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.14.RELEASE", "commit": { "sha": "22c07413ead1d12c6cddb42c3ad30f977512a0f9", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/22c07413ead1d12c6cddb42c3ad30f977512a0f9" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjE0LlJFTEVBU0U=" }, { "name": "v1.5.13.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.13.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.13.RELEASE", "commit": { "sha": "5533268f423d472dbc28ce694ccfa10bc1f98ddb", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/5533268f423d472dbc28ce694ccfa10bc1f98ddb" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjEzLlJFTEVBU0U=" }, { "name": "v1.5.12.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.12.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.12.RELEASE", "commit": { "sha": "9ec7fc58ddaf023871a1b22c44c4c2da9e43c40f", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/9ec7fc58ddaf023871a1b22c44c4c2da9e43c40f" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjEyLlJFTEVBU0U=" }, { "name": "v1.5.11.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.11.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.11.RELEASE", "commit": { "sha": "83ff0febd42ea1daff9010426559b52f275ef552", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/83ff0febd42ea1daff9010426559b52f275ef552" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjExLlJFTEVBU0U=" }, { "name": "v1.5.10.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.10.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.10.RELEASE", "commit": { "sha": "541890f0e003a6e346f2234102c97105ab1292ee", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/541890f0e003a6e346f2234102c97105ab1292ee" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjEwLlJFTEVBU0U=" }, { "name": "v1.5.9.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.9.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.9.RELEASE", "commit": { "sha": "1e8b9569d3a3900a0ed61712099823ad735b8078", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/1e8b9569d3a3900a0ed61712099823ad735b8078" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjkuUkVMRUFTRQ==" }, { "name": "v1.5.8.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.8.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.8.RELEASE", "commit": { "sha": "a4ddbcf23147875090f9c3c183a6c28891b7fb10", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/a4ddbcf23147875090f9c3c183a6c28891b7fb10" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjguUkVMRUFTRQ==" }, { "name": "v1.5.7.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.7.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.7.RELEASE", "commit": { "sha": "6ab07f8cf00ad3da1d110f0e5a6defcf872c0883", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/6ab07f8cf00ad3da1d110f0e5a6defcf872c0883" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjcuUkVMRUFTRQ==" }, { "name": "v1.5.6.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.6.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.6.RELEASE", "commit": { "sha": "a5229f24b8239bdeb7ed3edd78a007e37f10b264", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/a5229f24b8239bdeb7ed3edd78a007e37f10b264" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjYuUkVMRUFTRQ==" }, { "name": "v1.5.5.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.5.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.5.RELEASE", "commit": { "sha": "83b5a3bfce2fa49d47c6d20e78946454a6d636b1", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/83b5a3bfce2fa49d47c6d20e78946454a6d636b1" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjUuUkVMRUFTRQ==" }, { "name": "v1.5.4.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.4.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.4.RELEASE", "commit": { "sha": "924aabdad9eb1da7bfe5b075f9befa2d0b2374e8", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/924aabdad9eb1da7bfe5b075f9befa2d0b2374e8" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjQuUkVMRUFTRQ==" }, { "name": "v1.5.3.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.3.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.3.RELEASE", "commit": { "sha": "2f3a12270aa6183c30103adf524bdce967310790", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/2f3a12270aa6183c30103adf524bdce967310790" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjMuUkVMRUFTRQ==" }, { "name": "v1.5.2.RELEASE", "zipball_url": "https://api.github.com/repos/spring-projects/spring-boot/zipball/v1.5.2.RELEASE", "tarball_url": "https://api.github.com/repos/spring-projects/spring-boot/tarball/v1.5.2.RELEASE", "commit": { "sha": "cd316e7f3d492201e858c1dd6602a1d4e349f4b2", "url": "https://api.github.com/repos/spring-projects/spring-boot/commits/cd316e7f3d492201e858c1dd6602a1d4e349f4b2" }, "node_id": "MDM6UmVmNjI5Njc5MDp2MS41LjIuUkVMRUFTRQ==" }];
}
