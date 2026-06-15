import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private dialogOpenSubject = new BehaviorSubject<boolean>(false);

  isLoading$ = this.loadingSubject.asObservable();
  isDialogOpen$ = this.dialogOpenSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  openDialog() {
    this.dialogOpenSubject.next(true);
  }

  closeDialog() {
    this.dialogOpenSubject.next(false);
  }
}
