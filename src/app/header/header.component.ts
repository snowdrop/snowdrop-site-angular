import { Component } from "@angular/core";
import { Router } from "@angular/router";


export interface Page {
	name: string,
	id: string,
	route: string
}

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
	collapse: boolean;
	wizard: boolean;

	pages: Page[] = [
		{
			id: "get-started",
			name: "Get Started",
			route: "/wizard"
		},
		{
			id: "guides",
			name: "Guides",
			route: "/guides"
		},
		{
			id: "news",
			name: "News",
			route: "/news"
		},
		{
			id: "about",
			name: "About",
			route: "/about"
		},
	];

	constructor(private router: Router) {
		router.events.subscribe((url: any) => {
			if (url && url.url) {
				this.wizard = url.url.indexOf("wizard") > -1;
			}
		});
	}
}
