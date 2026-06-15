import { Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {
  @Input() tabs: string[] = []; // Tab Names
  @Output() tabChange = new EventEmitter<number>();
  @ContentChildren(TemplateRef) tabContents!: QueryList<TemplateRef<any>>; // Capture Tab Content

  activeTab: number = 0;

  selectTab(index: number) {
    this.activeTab = index;
    this.tabChange.emit(index);
  }
}
