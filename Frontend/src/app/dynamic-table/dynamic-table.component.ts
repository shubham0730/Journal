import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {
  columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'age', header: 'Age' },
    { key: 'email', header: 'Email' }
  ];

  data = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', selected: false },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', selected: false },
    { id: 3, name: 'Mark Johnson', age: 35, email: 'mark@example.com', selected: false },
    { id: 4, name: 'Emma Davis', age: 28, email: 'emma@example.com', selected: false },
    { id: 5, name: 'Chris Lee', age: 40, email: 'chris@example.com', selected: false },
    { id: 6, name: 'Chris Lee', age: 40, email: 'chris@example.com', selected: false }
  
  ];

  displayedColumns = ['select', ...this.columns.map(col => col.key)];
  dataSource = new MatTableDataSource(this.data);
  totalRecords = 5;
  pageSize = 5;

  ngOnInit() {}

  toggleSelectAll(event: any) {
    const isChecked = event.checked;
    this.data.forEach(item => item.selected = isChecked);
  }

  pageChanged(event: PageEvent) {
    // Handle page change if needed (you can call backend to fetch more data here)
    console.log('Page changed', event);
  }
}
