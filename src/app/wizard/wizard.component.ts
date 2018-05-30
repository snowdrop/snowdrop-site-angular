import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { KeycloakService } from "../shared/keycloak.service";

@Component({
	selector: "wizard",
	templateUrl: "./wizard.component.html",
	styleUrls: ["./wizard.component.scss"]
})
export class WizardComponent {
	constructor(private router: Router) { }

	back(): void {
		this.router.navigate(['/']);
	}
}
