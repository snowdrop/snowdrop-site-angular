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

	advancedMode = false;
	genForm = null;
	springbootVersions = [];
	snowdropVersions = [];
	snowdropVersionDefault = null;
	templates = [
		{
			name: "Simple",
			description: "A minimal application - modules & dependencies can be added below.",
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
	dependencies = [];

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
			this.gs.getGeneratorConfig().then((config) => {
				if (config) {
					if (config.bomversions) {
						for (let version of config.bomversions) {
							console.log("Version", version);
							this.snowdropVersions.push(version);

							if (version.default) {
								this.snowdropVersionDefault = version;
							}
						}
					}
					if (config.modules) {
						for (let m of config.modules) {
							m.value = m.name;
							console.log("Module", m);
							this.dependencies.push(m);
						}
					}
				}
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
		const pPattern = /^([a-z0-9-_$]+\.)*[a-z0-9-_$]+$/i;
		console.log("Default SD version", this.snowdropVersionDefault);
		this.genForm = this.fb.group({
			groupid: ['com.example', [Validators.required, Validators.pattern(gaPattern)]],
			artifactid: ['demo', [Validators.required, Validators.pattern(gaPattern)]],
			version: ["0.0.1-SNAPSHOT", [Validators.required, Validators.pattern(vPattern)]],
			packagename: ["com.example.demo", [Validators.required, Validators.pattern(pPattern)]],
			springbootversion: [this.snowdropVersionDefault.community, [Validators.required]],
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
			let values = JSON.parse(JSON.stringify(this.genForm.value));

			console.log("Submitted", values);

			if (this.dependencySelected && this.dependenciesSelected.length) {
				values.modules = this.dependenciesSelected.map(d => d.value);
			}
			console.log("Generating", values);
			this.gs.generate(values);
		}
	}
}
