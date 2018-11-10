import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FeedbackComponent } from "./feedback/feedback.component";
import { ChartComponent } from "./chart/chart.component";

const routes: Routes = [
  {
    path: "feedback",
    component: FeedbackComponent
  },
  {
    path: "chart",
    component: ChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
