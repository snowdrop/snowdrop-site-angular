import { Component, HostListener, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Http } from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { GeneratorService } from '../components/providers';

@Component({
	selector: "generator",
	templateUrl: "./generator.component.html",
	styleUrls: ["./generator.component.scss", "./generator.component.select.scss"]
})
export class GeneratorComponent implements OnInit, OnDestroy {

	// https://ng-select.github.io/ng-select#/multiselect-checkbox

	advancedMode = false;
	genForm = null;
	springbootVersions = [];
	snowdropVersions = [];
	snowdropVersionDefault = null;
	templates = [];
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
					if (config.templates) {
						config.templates.reverse();
						for (let t of config.templates) {
							t.value = t.name.toLocaleLowerCase();
							console.log("Template", t);
							this.templates.push(t);
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
	}

	isDependenciesEnabled() {
		return this.genForm && this.genForm.controls['template'].value === "simple";
	}

	searchDependencies(term: string, item) {
		term = term.toLocaleLowerCase();
		return item.name.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
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

			if (values.dependencies) {
				values.module = values.dependencies.map(d => d.value);
				values.dependencies = undefined;
			}
			console.log("Generating", values);
			this.gs.generate(values);
		}
	}
}
