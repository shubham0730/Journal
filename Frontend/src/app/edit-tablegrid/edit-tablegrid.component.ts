import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit-tablegrid',
  templateUrl: './edit-tablegrid.component.html',
  styleUrls: ['./edit-tablegrid.component.scss']
})
export class EditTablegridComponent implements OnInit {
  @Input() columns: any[] = [];   // Dynamic columns from parent
  @Input() rows: any[] = [];      // All data rows
  @Input() enableSelection: boolean = false; // Parent enables selection
  @Input() getStatusBadge: (status: string) => string = () => 'badge bg-secondary';
  @Input() mode: 'edit' | 'readonly' = 'readonly'; // default to readonly
  @Input() editableColumns: string[] = []; // list of fields that are editable

  filteredRows: any[] = [];  // Stores filtered rows (for search)
  filterText: string = '';   // Search input text
  allSelected: boolean = false; // Tracks "Select All" state

  constructor() { }

  ngOnInit(): void {
    this.applyDefaultDropdownValues();

    this.updateFilteredRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows'] && changes['rows'].currentValue !== changes['rows'].previousValue) {
      this.filteredRows = this.rows; // ✅ Ensure table updates
    }
  }

  /**
   * Updates the displayed rows based on search input.
   */
  updateFilteredRows(): void {
    if (this.filterText.trim()) {
      this.filteredRows = this.rows.filter(row =>
        Object.values(row).some(val =>
          val && String(val).toLowerCase().includes(this.filterText.toLowerCase())
        )
      );
    } else {
      this.filteredRows = [...this.rows]; // Display all rows from parent
    }

    // Reset selection
    if (this.enableSelection) {
      this.filteredRows.forEach(row => row.selected = this.allSelected);
    }
  }

  /**
   * Handles search input changes.
   */
  onSearchChange(): void {
    this.updateFilteredRows();
  }

  /**
   * Handles row actions (e.g., button clicks).
   */
  performAction(action: any, row: any): void {
    if (action?.action) {
      action.action(row);
    }
  }


  /**
   * Selects/Deselects all rows.
   */
  toggleSelectAll(event: any): void {
    this.allSelected = event.target.checked;
    this.filteredRows.forEach(row => row.selected = this.allSelected);
  }

  private applyDefaultDropdownValues(): void {
  this.rows.forEach(row => {
    this.columns.forEach(column => {
      if (
        column.type === 'dropdown' &&
        column.defaultValue &&
        !row[column.field]
      ) {
        row[column.field] = column.defaultValue(row);
      }
    });
  });
}
}
