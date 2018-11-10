import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { forkJoin, Observable, timer } from "rxjs";
import { map, switchMapTo } from "rxjs/operators";

@Component({
  selector: "app-data-page",
  templateUrl: "./data-page.component.html",
  styleUrls: ["./data-page.component.css"]
})
export class DataPageComponent implements OnInit {
  data$: Observable<any[]>;
  constructor(private readonly http: HttpClient) {
    this.data$ = timer(0, 5000).pipe(
      switchMapTo(
        forkJoin(
          http.get<any[]>("http://localhost:3000/sensors"),
          http.get<any[]>("http://localhost:3000/happiness")
        ).pipe(
          map(([x, y]) => [...x, ...y]),
          map(x =>
            x.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          ),
          map(x => {
            let lastRatio, lastNonRatio;
            return x
              .map(y => {
                if (y.ratio === undefined) {
                  lastNonRatio = y;
                  if (lastRatio) return { ...lastRatio, ...y };
                } else {
                  lastRatio = y;
                  if (lastNonRatio) return { ...lastNonRatio, ...y };
                }
                return y;
              })
              .reverse();
          })
        )
      )
    );
  }

  ngOnInit() {}
}
