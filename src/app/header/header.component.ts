import { Component } from "@angular/core";
import { KeycloakService } from "../shared/keycloak.service";
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
			route: "/wizard/all"
		},
		{
			id: "guides",
			name: "Guides",
			route: "/guides"
		},
		{
			id: "docs",
			name: "Documentation",
			route: "/docs"
		}, {
			id: "about",
			name: "About",
			route: "/about"
		},
	];

	constructor(private router: Router, private keycloak: KeycloakService) {
		router.events.subscribe((url: any) => {
			this.wizard = url.url !== "/" && url.url !== "/wizard";
		});
	}
}
