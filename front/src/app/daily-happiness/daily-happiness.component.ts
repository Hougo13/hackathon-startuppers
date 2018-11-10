import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Component({
  selector: "app-daily-happiness",
  templateUrl: "./daily-happiness.component.html",
  styleUrls: ["./daily-happiness.component.css"]
})
export class DailyHappinessComponent implements OnInit {
  // view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Hour";
  showYAxisLabel = true;
  yAxisLabel = "Happiness ratio";

  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"]
  };
  data$: Observable<any>;
  constructor(private readonly http: HttpClient) {
    this.data$ = http.get<any[]>("http://localhost:3000/happiness/hours");
  }

  ngOnInit() {}
}
