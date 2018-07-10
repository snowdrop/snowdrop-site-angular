import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-footer",
	templateUrl: "./footer.component.html",
	styleUrls: ["./footer.component.scss"],
})

export class FooterComponent {
	version: string;
	wizard: boolean;

	constructor(private router: Router) {
		router.events.subscribe((url: any) => {
			if (url && url.url) {
				this.wizard = url.url.indexOf("wizard") > -1;
			}
		});
	}

}
