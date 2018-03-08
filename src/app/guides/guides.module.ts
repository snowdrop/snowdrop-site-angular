import {APP_INITIALIZER, NgModule} from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { GuidesComponent } from './guides.component';
import { GuideViewComponent } from './guide-view/guide-view.component';
import { GuideDataService } from './guide-data.service';

import { CardModule } from 'patternfly-ng';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    GuidesComponent,
    GuideViewComponent,
  ],
  providers: [
    GuideDataService
  ]
})
export class GuidesModule {
}
