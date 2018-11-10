import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-my-bus-page",
  templateUrl: "./my-bus-page.component.html",
  styleUrls: ["./my-bus-page.component.css"]
})
export class MyBusPageComponent implements OnInit {
  id$: Observable<string>;
  uids$: Observable<string[]>;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient
  ) {
    this.id$ = route.paramMap.pipe(map(x => x.get("id")));
    this.uids$ = http.get<string[]>("http://localhost:3000/sensors/uids");
  }

  ngOnInit() {}
}
