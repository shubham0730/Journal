import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-decision-modal',
  templateUrl: './decision-modal.component.html',
})
export class DecisionModalComponent {
  comments: string = '';

  constructor(
    public dialogRef: MatDialogRef<DecisionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { decision: string }
  ) {}

  onConfirm() {
    this.dialogRef.close({ confirmed: true, comments: this.comments });
  }

  onCancel() {
    this.dialogRef.close({ confirmed: false });
  }
}
