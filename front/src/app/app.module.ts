import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { MatMenuModule } from "@angular/material/menu";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { AppRoutingModule } from "./app-routing.module";
import { NavbarComponent } from "./navbar/navbar.component";
import { DataService } from "./data.service";
import { AppComponent } from "./app.component";
import { FeedbackComponent } from "./feedback/feedback.component";

@NgModule({
  declarations: [AppComponent, NavbarComponent, FeedbackComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
