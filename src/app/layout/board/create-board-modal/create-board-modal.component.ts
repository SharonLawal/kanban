import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-create-board-modal',
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent {
  boardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private dialogRef: MatDialogRef<CreateBoardModalComponent>
  ) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      columns: this.fb.array([]),
    });
  }

  get columns(): FormArray {
    return this.boardForm.get('columns') as FormArray;
  }

  addColumn(): void {
    this.columns.push(this.fb.control('', Validators.required));
  }

  removeColumn(index: number): void {
    this.columns.removeAt(index);
  }

  onSubmit(): void {
    if (this.boardForm.valid) {
      const { name, columns } = this.boardForm.value;
      const trimmedColumns = columns
        .map((colName: string) => colName.trim())
        .filter((colName: string) => colName !== '');

      const newBoard = {
        name: name.trim(),
        columns: trimmedColumns.map((colName: string) => ({
          id: this.boardService.generateId(),
          name: colName,
          tasks: [],
        })),
      };

      const createdBoard = this.boardService.createBoard(newBoard);
      this.dialogRef.close(createdBoard);
    }
  }
}
