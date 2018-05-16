import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormComponent } from "./wizard/wizard.component";
import { AboutComponent } from "./about/about.component";
import { DocsComponent } from "./docs/docs.component";
import { HomeComponent } from "./home/home.component";
import { GuidesComponent } from "./guides/guides.component";
import { GuideViewComponent } from "./guides/guide-view/guide-view.component";
import { IntroComponent } from "./wizard/pages/intro/intro.component";

const routes: Routes = [
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
		path: "guides",
		children: [{
			path: "",
			component: GuidesComponent
		}, {
			path: ":guideId",
			component: GuideViewComponent
		}]
	},
	{
		/* keeping this in pace in case someone bookmarked the old rotues */
		path: "wizard",
		children: [
			{
				path: "",
				redirectTo: "/filtered-wizard/all",
				pathMatch: "full",
			},
			{
				path: ":command/:step",
				redirectTo: "/filtered-wizard/all/:command/:step",
				pathMatch: "full",
			},
			{
				path: ":command/:step/:state",
				redirectTo: "/filtered-wizard/all/:command/:step/:state",
				pathMatch: "full",
			}
		]
	},
	{
		path: "filtered-wizard",
		children: [
			{
				path: ":filters",
				component: IntroComponent,
				data: {
					name: "intro"
				}
			},
			{
				path: ":filters/:command/:step",
				component: FormComponent,
				data: {
					name: "step"
				}
			},
			{
				path: ":filters/:command/:step/:state",
				component: FormComponent,
				data: {
					name: "step"
				}
			}
		]
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
