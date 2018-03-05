import {APP_INITIALIZER, NgModule} from "@angular/core";
import { GuidesComponent } from './guides.component';

import { CardModule } from 'patternfly-ng';

@NgModule({
  imports: [
    CardModule,
  ],
  declarations: [
    GuidesComponent
  ],
  providers: [
  ]
})
export class GuidesModule {
}
