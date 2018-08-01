import { APP_INITIALIZER, NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AboutComponent } from './about.component';
import { ComponentsModule } from '../components';

@NgModule({
	imports: [
		CommonModule,
		ComponentsModule,
		FormsModule,
		RouterModule
	],
	declarations: [
		AboutComponent,
	],
	providers: [
	]
})
export class AboutModule {
}
