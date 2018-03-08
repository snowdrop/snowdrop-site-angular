import {APP_INITIALIZER, NgModule} from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DocsComponent } from './docs.component';
import { ComponentsModule } from '../components';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule
  ],
  declarations: [
    DocsComponent,
  ],
  providers: [
  ]
})
export class DocsModule {
}
