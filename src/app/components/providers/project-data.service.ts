import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { RegistryService } from './registry.service';

@Injectable()
export class ProjectDataService implements OnInit, OnDestroy {

	constructor(
		private http: Http,
		private registryService: RegistryService
	) {
	}

	ngOnDestroy() {
	}

	private _ready: Promise<void> = null;
	private projects: any[];
	private registry: any;

	ngOnInit(): void {
		this.ready();
	}

	public ready() {
		if (!this._ready) {
			console.log("ProjectDataService starting up.");
			this._ready = this.registryService.getRegistry().then((registry) => {
				console.log("ProjectDataService initialized.");
				this.registry = registry;
				this.getProjects();
			});
		}
		return this._ready;
	}

	public getProjects() {
		if (!this.projects) {
			let result = [];
			let notNullOrEmpty = (value) => {
				return value && value.trim() !== 0;
			};

			if (this.registry) {
				for (let p of this.registry.projects) {
					result.push(p);
				}
			}
			this.projects = result;
		}

		return this.projects;
	}

	public getProjectByName(name: string) {
		if (this.projects && name && name.trim().length > 0) {
			name = this.urlify(name);
			for (let project of this.getProjects()) {
				if (project && this.urlify(project.name) === name) {
					return project;
				}
			}
		}
		return null;
	}

	private urlify(value: string) {
		if (!value) return value;
		return value.toLowerCase().replace(/[^a-z0-9]/gi, "-").replace("-+", "-");
	}
}
