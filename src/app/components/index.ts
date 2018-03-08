import {APP_INITIALIZER, NgModule, ModuleWithProviders} from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AsciidoctorComponent } from './asciidoctor/asciidoctor.component';
export * from './asciidoctor/asciidoctor.component';

let COMPONENTS = [
  AsciidoctorComponent
];

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
  ]
})
export class ComponentsModule {

	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ComponentsModule,
			providers: []
		};
	}
}
