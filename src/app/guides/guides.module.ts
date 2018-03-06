import {APP_INITIALIZER, NgModule} from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { GuidesComponent } from './guides.component';

import { CardModule } from 'patternfly-ng';

@NgModule({
  imports: [ 
    CardModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    GuidesComponent
  ],
  providers: [
  ]
})
export class GuidesModule {
}
