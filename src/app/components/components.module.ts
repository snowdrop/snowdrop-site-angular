import { APP_INITIALIZER, NgModule, ModuleWithProviders } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

export * from './asciidoctor/asciidoctor.component';
import { AsciidoctorComponent } from './asciidoctor/asciidoctor.component';

export * from './providers';
import { RegistryService } from './providers';
import { GuideDataService } from './providers';
import { ProjectDataService } from './providers';

let COMPONENTS = [
	AsciidoctorComponent
];

let PROVIDERS = [
	RegistryService,
	GuideDataService,
	ProjectDataService
]

@NgModule({
	declarations: [
		...COMPONENTS
	],
	entryComponents: [
		...COMPONENTS
	],
	imports: [
		CommonModule,
		FormsModule
	],
	exports: [
		...COMPONENTS
	],
	providers: [
		...PROVIDERS
	]
})
export class ComponentsModule {

	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ComponentsModule,
			providers: [...PROVIDERS]
		};
	}
}
