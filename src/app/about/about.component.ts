import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { ActivatedRoute } from "@angular/router";
import { RegistryService } from "../components";

@Component({
	selector: "about-component",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit, OnDestroy {

	constructor(
		private registryService: RegistryService,
		private route: ActivatedRoute,
		private http: Http,
	) {
	}

	ngOnInit() {

	}

	ngOnDestroy() {
	}

}
