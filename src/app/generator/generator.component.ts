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
			description: "An application with database connectivity and basic access methods.",
			value: "crud"
		},
		{
			name: "REST",
			description: "An application with database connectivity and a scaffolded REST API.",
			value: "rest"
		}
	];
	dependencies = [
		{
			name: "Web & MVC",
			description: "Tomcat and Spring Web MVC",
			value: "web"
		},
		{
			name: "Web Sockets",
			description: "Websockets and streaming of messages",
			value: "websocket"
		},
		{
			name: "REST (JAX-RS)",
			description: "Apache CXF JAX-RS specification",
			value: "jax-rs"
		}
	];

	dependenciesSelected = [];

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
		const gaPattern = /^([a-z0-9-_]+\.)*[a-z0-9-_]+$/i;
		const vPattern = /^([a-z0-9-_]+\.)*[a-z0-9-_]+$/i;
		this.genForm = this.fb.group({
			groupId: ['io.snowdrop', [Validators.required, Validators.pattern(gaPattern)]],
			artifactId: ['starter', [Validators.required, Validators.pattern(gaPattern)]],
			version: [null, [Validators.pattern(vPattern)]],
			bomVersion: [this.snowdropVersions[0], [Validators.required]],
			template: [this.templates[0].value, [Validators.required]],
			dependencies: [[]]
		});
		this.genForm.controls['dependencies'].valueChanges.subscribe((value) => {
			this.dependencySelected(this.getDependency(value));
		});
	}

	getDependency(value) {
		for (let d of this.dependencies) {
			if (d.value === value) {
				return d;
			}
		}
		return null;
	}

	isDependenciesEnabled() {
		return this.genForm && this.genForm.controls['template'].value === "simple";
	}

	dependencySelected(d) {
		console.log("Selected", d);
		if (d) {
			if (this.dependenciesSelected.indexOf(d) === -1) {
				this.dependenciesSelected.push(d);
				this.genForm.controls['dependencies'].setValue(null);
			}
		}
	}

	isDependencySelected(d) {
		if (d) {
			if (this.dependenciesSelected.indexOf(d) > -1) {
				return true;
			}
		}
		return false;
	}

	removeDependency(d) {
		const index = this.dependenciesSelected.indexOf(d);
		if (index > -1) {
			this.dependenciesSelected.splice(index, 1);
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

	canGenerate() {
		return this.genForm.valid;
	}

	generate() {
		if (this.canGenerate()) {
			console.log("Generating", this.genForm.value);
			let values = JSON.parse(JSON.stringify(this.genForm.value));
			if (!values.version) {
				values.version = "1.0.0-SNAPSHOT";
			}
			if (this.dependencySelected && this.dependenciesSelected.length) {
				values.dependencies = this.dependenciesSelected;
			}
			this.gs.generate(values);
		}
	}
}
