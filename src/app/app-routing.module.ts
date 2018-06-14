import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { DocsComponent } from "./docs/docs.component";
import { NewsComponent } from "./news/news.component";
import { NewsViewComponent } from "./news/news-view/news-view.component";
import { HomeComponent } from "./home/home.component";
import { GuidesComponent } from "./guides/guides.component";
import { GuideViewComponent } from "./guides/guide-view/guide-view.component";

/* New Wizard */
import { WizardComponent } from "./wizard/wizard.component";
import { GettingStartedComponent } from "./wizard/pages/getting-started/getting-started.component";

const routes: Routes = [
	{
		path: 'wizard/:projectName',
		component: WizardComponent,
		pathMatch: 'full'

	},
	{
		path: "wizard",
		component: GettingStartedComponent,
		pathMatch: 'full'
	},
	{
		path: "",
		children: [{
			path: "",
			component: HomeComponent
		}]
	}, {
		path: "about",
		children: [{
			path: "",
			component: AboutComponent
		}]
	},
	{
		path: "docs",
		children: [{
			path: "",
			component: DocsComponent
		}]
	},
	{
		path: "news",
		children: [{
			path: "",
			component: NewsComponent
		}, {
			path: ":articleId",
			component: NewsViewComponent
		}]
	},
	{
		path: "guides",
		children: [{
			path: "",
			component: GuidesComponent
		}, {
			path: ":guideId",
			component: GuideViewComponent
		}]
	},
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		useHash: false
	})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
