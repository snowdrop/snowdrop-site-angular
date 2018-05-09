import { APP_INITIALIZER, NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ComponentsModule } from '../components';

import { GuidesComponent } from './guides.component';
import { GuideViewComponent } from './guide-view/guide-view.component';
import { GuideDataService } from './guide-data.service';

@NgModule({
	imports: [
		CommonModule,
		ComponentsModule,
		FormsModule
	],
	declarations: [
		GuidesComponent,
		GuideViewComponent,
	],
	providers: [
		GuideDataService
	]
})
export class GuidesModule {
}
