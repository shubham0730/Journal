import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() offset: number = 0; // Current page index (0-based)
  @Input() totalPagesApproved: number = 1; // Total pages
  @Output() offsetChange: EventEmitter<number> = new EventEmitter<number>();

  firstPage() {
    if (this.offset !== 0) {
      this.offset = 0;
      this.offsetChange.emit(this.offset);
    }
  }

  prevPage() {
    if (this.offset > 0) {
      this.offset--;
      this.offsetChange.emit(this.offset);
    }
  }

  nextPage() {
    if (this.offset < this.totalPagesApproved - 1) {
      this.offset++;
      this.offsetChange.emit(this.offset);
    }
  }

  lastPage() {
    if (this.offset !== this.totalPagesApproved - 1) {
      this.offset = this.totalPagesApproved - 1;
      this.offsetChange.emit(this.offset);
    }
  }

  goToPage(event: any) {
    let page = Number(event.target.value);
    if (!isNaN(page) && page >= 1 && page <= this.totalPagesApproved) {
      this.offset = page - 1;
      this.offsetChange.emit(this.offset);
    } else {
      event.target.value = this.offset + 1; // Reset to the current page if input is invalid
    }
  }
}
