import { APP_INITIALIZER, NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { ComponentsModule } from '../components';

import { GeneratorComponent } from './generator.component';

@NgModule({
	imports: [
		CommonModule,
		ComponentsModule,
		FormsModule,
		NgSelectModule,
		ReactiveFormsModule,
		RouterModule
	],
	declarations: [
		GeneratorComponent,
	],
	providers: [
	]
})
export class GeneratorModule {
}
