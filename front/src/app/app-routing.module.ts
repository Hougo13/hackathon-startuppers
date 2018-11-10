import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FeedbackComponent } from "./feedback/feedback.component";
import { ChartComponent } from "./chart/chart.component";
import { MyBusPageComponent } from "./my-bus-page/my-bus-page.component";
import { DataPageComponent } from "./data-page/data-page.component";

const routes: Routes = [
  {
    path: "data",
    component: DataPageComponent
  },
  {
    path: "chart",
    component: ChartComponent
  },
  {
    path: "my-bus/:id",
    component: MyBusPageComponent
  },
  {
    path: "my-bus",
    component: MyBusPageComponent
  },
  {
    path: "",
    redirectTo: "/my-bus",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
