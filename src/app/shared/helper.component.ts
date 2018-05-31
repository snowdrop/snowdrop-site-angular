import { Config, HelperService } from "ngx-forge";
import { Location } from "@angular/common";

export class LaunchHelper extends HelperService {
	private readonly launchConfig: Config;

	constructor(config: Config) {
		super(config);
		this.launchConfig = config;
	}

	getBackendUrl(): string {
		let url = this.launchConfig.get('backend_api_url') ? this.launchConfig.get('backend_api_url') : "";
		return Location.stripTrailingSlash(url);
	}

	getOrigin(): string {
		return this.launchConfig.get('origin');
	}
}
