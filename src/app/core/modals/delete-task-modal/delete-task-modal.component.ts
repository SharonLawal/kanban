import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { Task } from '../../models/task.model';
import { BoardService } from '../../services/board.service';
import { ViewTaskModalComponent } from '../view-task-modal/view-task-modal.component';

@Component({
  selector: 'app-delete-task-modal',
  templateUrl: './delete-task-modal.component.html',
  styleUrls: ['./delete-task-modal.component.scss'],
})
export class DeleteTaskModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { board: Board; column: Column; task: Task },
    private boardService: BoardService
  ) {}

  confirmDelete() {
    this.boardService.deleteTask(this.data.board.id, this.data.column.id, this.data.task.id);
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
