import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Component({
  selector: "app-data-page",
  templateUrl: "./data-page.component.html",
  styleUrls: ["./data-page.component.css"]
})
export class DataPageComponent implements OnInit {
  data$: Observable<any[]>;
  constructor(private readonly http: HttpClient) {
    this.data$ = http.get<any[]>("http://localhost:3000/sensors");
  }

  ngOnInit() {}
}
