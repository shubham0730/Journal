import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {

  latestJournals = [
    { id: 1, title: 'Advancements in Oncology Research', summary: 'Latest Trends in precision Oncology.' },
    {
      id: 2,
      title: 'Stereotactic Body Radiotherapy in Clinical Practice',
      summary: 'What is new in stereotactic radiosurgey.'
    },
    {
      id: 3,
      title: 'Artificial inteeligince in Oncology',
      summary: 'Organ Preservation in Cancer'
    }]
  constructor() { }

  ngOnInit(): void {
  }

}
