import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { Logger } from "./shared/logger.service";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";

import { DocsModule } from "./docs/docs.module";
import { GuidesModule } from "./guides/guides.module";
import { WizardModule } from "./wizard/wizard.module";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    WizardModule,
    DocsModule,
    GuidesModule,
  ],
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  providers: [
    Logger
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
