import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { single } from "./data";

import { map } from "rxjs/operators";
@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"]
})
export class ChartComponent {
  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Hour";
  showYAxisLabel = true;
  yAxisLabel = "C°";

  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"]
  };
  data$: Observable<any[]>;

  constructor(private http: HttpClient) {
    Object.assign(this, { single });
    this.data$ = http
      .get<any>("http://localhost:3000/sensors/temperatures")
      .pipe(
        map(data => {
          return Object.keys(data.items["005A694ed"]).map(key => ({
            name: key,
            value: data.items["005A694ed"][key]
          }));
        })
      );
  }

  onSelect(event) {
    console.log(event);
  }
}
