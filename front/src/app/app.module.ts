import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { MatMenuModule } from "@angular/material/menu";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { AppRoutingModule } from "./app-routing.module";
import { NavbarComponent } from "./navbar/navbar.component";
import { DataService } from "./data.service";
import { AppComponent } from "./app.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { MatTableModule } from "@angular/material/table";
import { ChartComponent } from "./chart/chart.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FeedbackComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    NgxChartsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
