import { Component, HostListener, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { GeneratorService } from '../components/providers';

@Component({
	selector: "generator",
	templateUrl: "./generator.component.html",
	styleUrls: ["./generator.component.scss"]
})
export class GeneratorComponent implements OnInit, OnDestroy {

	genForm = null;
	springbootVersions = [];
	snowdropVersions = [];
	templates = [
		{
			name: "Simple",
			description: "A minimal application with no extra dependencies or frameworks.",
			value: "simple"
		},
		{
			name: "CRUD",
			description: "An application with database connectivity and basic access methods for CREATE, READ, UPDATE, DELETE.",
			value: "crud"
		},
		{
			name: "REST",
			description: "An application with database connectivity and a scaffolded REST API.",
			value: "rest"
		}
	];
	modules = [
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

	modulesSelected = [];

	constructor(
		private route: ActivatedRoute,
		private http: Http,
		private fb: FormBuilder,
		private gs: GeneratorService
	) {
	}

	ngOnDestroy() {
	}

	actionsText: string = '';
	filterText: string = ''
	categories: any[];

	ngOnInit(): void {
		Promise.all([
			this.gs.getSnowdropVersions().then((versions) => {
				this.snowdropVersions = versions.map((v) => v.name);
			}),
			this.gs.getSpringBootVersions().then((versions) => {
				this.springbootVersions = versions.map((t) => t.name);
			})
		]).then(() => {
			this.initForm();
		});
	}

	@HostListener('document:keypress', ['$event'])
	private onKeyDown(e) {
		console.log("Keydown", e);
		if (e.ctrlKey && e.key == "Enter") {
			console.log('ctrl and enter');
			this.generate();
		}
	}

	initForm() {
		this.genForm = this.fb.group({
			groupId: ['io.snowdrop', [Validators.required]],
			artifactId: ['starter', [Validators.required]],
			version: [null, []],
			bomVersion: [this.snowdropVersions[0], [Validators.required]],
			springbootVersion: [this.springbootVersions[0], [Validators.required]],
			template: [this.templates[0].value, [Validators.required]],
			modules: [[]]
		});
		this.genForm.controls['modules'].valueChanges.subscribe((value) => {
			this.moduleSelected(value);
		});
	}

	moduleSelected(mod) {
		console.log(mod)
		if (mod && mod.trim() !== "" && mod.trim().length > 0) {
			if (this.modulesSelected.indexOf(mod) === -1) {
				this.modulesSelected.push(mod);
				this.genForm.controls['modules'].setValue(null);
			}
		}
	}

	isModuleSelected(mod) {
		if (mod) {
			if (this.modulesSelected.indexOf(mod.trim()) > -1) {
				return true;
			}
		}
		return false;
	}

	removeModule(mod) {
		const index = this.modulesSelected.indexOf(mod);
		if (index > -1) {
			this.modulesSelected.splice(index, 1);
		}
	}

	selectTemplate(t) {
		this.genForm.controls['template'].setValue(t);
	}

	getTemplateDescription() {
		for (let t of this.templates) {
			if (t.value === this.genForm.controls['template'].value) {
				return t.description;
			}
		}
		return "";
	}

	generate() {
		console.log("Generating", this.genForm.value);
		let values = JSON.parse(JSON.stringify(this.genForm.value));
		if (!values.version) {
			values.version = "1.0.0-SNAPSHOT";
		}
		this.gs.generate(values);
	}
}
