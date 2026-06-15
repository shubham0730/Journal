import { Component, OnInit } from '@angular/core';

interface Article {
  title: string;
  authors: string[];
  journal: string;
  citation: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-current-issue',
  templateUrl: './current-issue.component.html',
  styleUrls: ['./current-issue.component.scss']
})
export class CurrentIssueComponent implements OnInit {
  journalCover = '/api/placeholder/200/300';
  issueInfo = 'December 2024 - Volume 20 - Issue 7';
  
  article: Article = {
    title: 'Research progress on the structural and anti-colorectal malignant tumor properties of Shikonin',
    authors: ['Chen, Jinghua', 'Liu, Jie', 'Nie, Weiwei'],
    journal: 'Journal of Cancer Research and Therapeutics',
    citation: '20(7):1957-1963, December 2024',
    isOpen: false
  };

  constructor() { }

  ngOnInit(): void {
  }
  

  toggleArticle() {
    this.article.isOpen = !this.article.isOpen;
  }

}
