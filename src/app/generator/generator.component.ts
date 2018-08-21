import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

// import { GeneratorService } from '../components/providers';

@Component({
	selector: "generator",
	templateUrl: "./generator.component.html",
	styleUrls: ["./generator.component.scss"]
})
export class GeneratorComponent implements OnInit, OnDestroy {

	genForm = null;
	versions = [];
	modules = [];

	modulesSelected = [];

	constructor(
		private route: ActivatedRoute,
		private http: Http,
		private fb: FormBuilder,
		// private guideService: GuideDataService
	) {
	}

	ngOnDestroy() {
	}

	actionsText: string = '';
	filterText: string = ''
	categories: any[];

	ngOnInit(): void {
		this.initForm();
	}

	initForm() {

		this.modules = [
			{
				name: "Web",
				value: "org.example.web"
			},
			{
				name: "Security",
				value: "org.example.security"
			},
			{
				name: "Database - Relational",
				value: "org.example.hibernate"
			},
			{
				name: "Database - Object",
				value: "org.example.mongodb"
			},
			{
				name: "Messaging - JMS",
				value: "org.example.messaging"
			},
		];
		this.versions = [
			"1.15.0",
			"1.15.1",
			"1.15.2"
		];
		this.genForm = this.fb.group({
			groupId: ['io.snowdrop', [Validators.required]],
			artifactId: ['starter', [Validators.required]],
			version: [this.versions[0], [Validators.required]],
			modules: [[]]
		});
		this.genForm.controls['modules'].valueChanges.subscribe((value) => {
			this.moduleSelected(value);
		});
	}

	moduleSelected(mod) {
		console.log(mod)
		if (this.modulesSelected.indexOf(mod) === -1) {
			this.modulesSelected.push(mod);
		}
	}

	removeModule(mod) {
		const index = this.modulesSelected.indexOf(mod);
		if (index > -1) {
			this.modulesSelected.splice(index, 1);
		}
	}

	generate() {
		console.log("Generating");
	}
}
