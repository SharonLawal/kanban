import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  isOpen = true;
  editBoardForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { boardName: string; columns: string[] }
  ) {}

  ngOnInit(): void {
    console.log('EditModalComponent initialized with:', this.data);

    this.editBoardForm = this.fb.group({
      name: [this.data.boardName, Validators.required],
      columns: this.fb.array(this.data.columns.map(name => this.fb.control(name, Validators.required)))
    });
  }

  get columnsArray(): FormArray {
    return this.editBoardForm.get('columns') as FormArray;
  }

  addColumn(): void {
    this.columnsArray.push(this.fb.control('', Validators.required));
  }

  removeColumn(index: number): void {
    this.columnsArray.removeAt(index);
  }

  saveChanges(): void {
    if (this.editBoardForm.valid) {
      this.dialogRef.close(this.editBoardForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
