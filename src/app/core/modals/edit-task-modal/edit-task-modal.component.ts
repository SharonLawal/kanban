import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { Task } from '../../models/task.model';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss'],
})
export class EditTaskModalComponent {
  boardName: string;
  columns: Column[];
  newColumnName: string = '';
  selectedStatus: string;

  constructor(
    public dialogRef: MatDialogRef<EditTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { board: Board; column: Column; task: Task },
    private boardService: BoardService
  ) {
    this.boardName = data.board.name;
    this.columns = data.board.columns || [];

    this.selectedStatus = this.data.column.id;

    if (
      this.data.task.status &&
      this.columns.some((c) => c.name === this.data.task.status)
    ) {
      const matchingColumn = this.columns.find(
        (c) => c.name === this.data.task.status
      );
      this!.selectedStatus = matchingColumn!.id;
    }
  }

  addSubtask() {
    this.data.task.subtasks = this.data.task.subtasks || [];
    this.data.task.subtasks.push({
      id: this.boardService.generateId(),
      title: '',
      isCompleted: false,
    });
  }

  removeSubtask(index: number) {
    this.data.task.subtasks.splice(index, 1);
  }

  saveChanges() {
    if (this.selectedStatus !== this.data.column.id) {
      this.boardService.moveTask(
        this.data.board.id,
        this.data.column.id,
        this.selectedStatus,
        this.data.task.id
      );
    } else {
      this.boardService.updateTask(
        this.data.board.id,
        this.data.column.id,
        this.data.task
      );
    }
    this.dialogRef.close();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
