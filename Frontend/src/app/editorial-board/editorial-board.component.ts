import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editorial-board',
  templateUrl: './editorial-board.component.html',
  styleUrls: ['./editorial-board.component.scss']
})
export class EditorialBoardComponent implements OnInit {
  editorialBoard = [
    { role: 'Editor in Chief', name: 'Dr. Kaustav Talapatra', designation: 'Mumbai', email: 'journalofroco@gmail.com' },
    { role: 'Editorial Advisor', name: 'Dr. Mandar Deshpande', designation: 'Mumbai' },
    { role: 'Editorial Advisor', name: 'Dr. Sarbani Ghosh Laskar', designation: 'Mumbai' },
    { role: 'Editorial Advisor', name: 'Dr. Rajesh Balakrishnan', designation: 'Vellore' },
    { role: 'Editorial Board', name: 'Dr. Nikhil Bardeskar', designation: 'North Carolina, USA' },
    { role: 'Editorial Board', name: 'Dr. Anupam Datta', designation: 'Kolkata' },
    { role: 'Editorial Board', name: 'Dr. Pritanjali Singh', designation: 'Patna' },
    { role: 'Editorial Board', name: 'Dr. Devendra Chaukar', designation: 'Mumbai' },
    { role: 'Editorial Board', name: 'Dr. Divya  Khosla', designation: 'Chandigarh' },
    { role: 'Editorial Board', name: 'Dr. Jerome  Bosco', designation: 'United Kingdom' },
    { role: 'Editorial Board', name: 'Dr. Ajitesh  Avinash', designation: 'Bhubaneswar' },
    { role: 'Editorial Board', name: 'Dr. Kanhu Charan Patro', designation: 'Visakhapatnam' },
    { role: 'Editorial Board', name: 'Dr. Garvit Chitkara', designation: 'Mumbai' },
    { role: 'Editorial Board', name: 'Dr. Shruti Gohel', designation: 'Ahmedabad' },
    { role: 'Editorial Board', name: 'Dr. Ajinkya Gupte', designation: 'Mumbai' },
    { role: 'Editorial Board', name: 'Dr. Sayan Paul', designation: 'Kolkata' },
    { role: 'Editorial Board', name: 'Dr. Kinjal Jani', designation: 'Ahmedabad' },
    { role: 'Editorial Assistant', name: 'Dr. Subrata Roy', designation: 'Mumbai' },
    { role: 'Technical & Language Editors', name: 'Ms. Rashmi Bhattacharjee', designation: 'Bengaluru' },
    { role: 'Technical & Language Editors', name: 'Mr. Adwait Laud', designation: 'Mumbai' }
  ];

  // Correct types
  editorInChief?: { role: string, name: string, designation: string, email?: string };
  editorialAssistant?: { role: string, name: string, designation: string, email?: string };
  advisors: { role: string, name: string, designation: string, email?: string }[] = [];
  boardMembers: { role: string, name: string, designation: string, email?: string }[] = [];
  langEditors: { role: string, name: string, designation: string, email?: string }[] = [];

  constructor() { }

  ngOnInit(): void {
    this.editorInChief = this.editorialBoard.find(e => e.role === 'Editor in Chief');
    this.advisors = this.editorialBoard.filter(e => e.role === 'Editorial Advisor');
    this.boardMembers = this.editorialBoard.filter(e => e.role === 'Editorial Board');
    this.langEditors = this.editorialBoard.filter(e => e.role === 'Technical & Language Editors');
    this.editorialAssistant = this.editorialBoard.find(e => e.role === 'Editorial Assistant');
  }
}