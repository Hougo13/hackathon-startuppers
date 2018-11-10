import { Component, OnInit } from "@angular/core";

export interface PeriodicData {
  cardId: string;
  hapiness: number;
  cO2: number;
  temperature: number;
  acceleration: number;
  decibel: number;
}

const ELEMENT_DATA: PeriodicData[] = [
  {
    cardId: "test",
    hapiness: 2,
    cO2: 1.0079,
    temperature: 4,
    acceleration: 1,
    decibel: 9
  }
];

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"]
})
export class FeedbackComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  displayedColumns: string[] = [
    "cardId",
    "hapiness",
    "CO2",
    "temperature",
    "acceleration",
    "decibel"
  ];
  dataSource = ELEMENT_DATA;
}
