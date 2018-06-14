import { APP_INITIALIZER, NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';

import { ComponentsModule } from '../components';

import { GuidesComponent } from './guides.component';
import { GuideViewComponent } from './guide-view/guide-view.component';
import { GuideDataService } from './guide-data.service';


import { LaunchConfig } from "../shared/config.component";
import { Config, HelperService } from "ngx-forge";

export class Helper extends HelperService {
	constructor(config: Config) {
		super(config);
	}

	getBackendUrl(): string {
		let url = super.getBackendUrl();
		return url.substr(0, url.indexOf('launchpad'));
	}
}

@NgModule({
	imports: [
		CommonModule,
		ComponentsModule,
		FormsModule,
		RouterModule
	],
	declarations: [
		GuidesComponent,
		GuideViewComponent,
	],
	providers: [
		GuideDataService,
		LaunchConfig,
		{ provide: HelperService, useClass: Helper, deps: [LaunchConfig] },
	]
})
export class GuidesModule {
}
