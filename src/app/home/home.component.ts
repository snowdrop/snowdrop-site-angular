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
		this.router.navigate(["/wizard"]);
	}

	goToGuides() {
		this.router.navigate(["/guides"]);
	}

	openURL(url) {
		window.open(url, '_blank');
	}

	scrollDown() {
		window.scrollBy({
			left: 0,
			top: 400,
			behavior: 'smooth'
		});
	}
}
