import { Component, OnInit, Input, ViewChild, OnChanges } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

export interface PeriodicData {
  cardId: string;
  hapiness: number;
  cO2: number;
  temperature: number;
  acceleration: number;
  noise: number;
  humidity: number;
}

const ELEMENT_DATA: PeriodicData[] = [
  {
    cardId: "test",
    hapiness: 2,
    cO2: 1.0079,
    temperature: 4,
    acceleration: 1,
    noise: 9,
    humidity: 9
  }
];

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"]
})
export class FeedbackComponent implements OnInit, OnChanges {
  @Input() data: any[];
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any[]>;

  constructor() {}
  ngOnInit() {}

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.data ? this.data : []);
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = [
    "uid",
    "createdAt",
    // "hapiness",
    // "CO2",
    "temperature",
    "acceleration",
    "noise",
    "humidity"
  ];
}
