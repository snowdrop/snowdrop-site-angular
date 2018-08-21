import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Logger } from './shared/logger.service';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { Broadcaster } from 'ngx-base';


import { HomeComponent } from "./home/home.component";

import { AboutModule } from "./about/about.module";
import { ComponentsModule } from "./components/components.module";
import { DocsModule } from "./docs/docs.module";
import { NewsModule } from "./news/news.module";
import { GeneratorModule } from "./generator/generator.module";
import { GuidesModule } from "./guides/guides.module";

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,

		//Page modules
		ComponentsModule.forRoot(),

		AboutModule,
		DocsModule,
		NewsModule,
		GeneratorModule,
		GuidesModule
	],
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,

		//Pages
		HomeComponent
	],
	providers: [
		Broadcaster,
		Logger,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
