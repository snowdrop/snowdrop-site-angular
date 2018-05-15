import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
	constructor(private router: Router) { }

	launch() {
		this.router.navigate(["/wizard", "launchpad-new-project", 1, "e30="]);
	}

	scrollDown() {
		window.scrollBy({
			left: 0,
			top: 400,
			behavior: 'smooth'
		});
	}
}
