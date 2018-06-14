import { APP_INITIALIZER, NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ComponentsModule } from '../components';

import { NewsComponent } from './news.component';
import { NewsViewComponent } from './news-view/news-view.component';
import { NewsDataService } from './news-data.service';

@NgModule({
	imports: [
		CommonModule,
		ComponentsModule,
		HttpModule,
		FormsModule,
		RouterModule
	],
	declarations: [
		NewsComponent,
		NewsViewComponent,
	],
	providers: [
		NewsDataService,
	]
})
export class NewsModule {
}
