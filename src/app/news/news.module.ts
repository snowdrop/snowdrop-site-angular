import { APP_INITIALIZER, NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NewsComponent } from './news.component';
import { ComponentsModule } from '../components';

@NgModule({
	imports: [
		CommonModule,
		ComponentsModule,
		FormsModule
	],
	declarations: [
		NewsComponent,
	],
	providers: [
	]
})
export class NewsModule {
}
