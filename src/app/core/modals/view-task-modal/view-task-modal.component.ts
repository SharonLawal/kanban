import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-view-task-modal',
  templateUrl: './view-task-modal.component.html',
  styleUrls: ['./view-task-modal.component.scss'],
})
export class ViewTaskModalComponent {
  columns: Column[];
  selectedStatus: string;

  constructor(
    public dialogRef: MatDialogRef<ViewTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { board: Board; column: Column; task: Task },
    private boardService: BoardService
  ) {
    this.columns = data.board.columns || [];
    this.selectedStatus = this.data.column.id;

    this.dialogRef.backdropClick().subscribe(() => {
      this.saveChanges();
    });

    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.saveChanges();
      }
    });
  }

  get boardColumns(): string[] {
    const columns = this.boardService.getColumns(this.data.board.id);
    return columns.map((col) => col.name);
  }

  get completedSubtasksCount(): number {
    return this.data.task.subtasks.filter((s) => s.isCompleted).length;
  }

  toggleSubtask(index: number): void {
    const subtask = this.data.task.subtasks[index];
    subtask.isCompleted = !subtask.isCompleted;

    this.boardService.updateTask(
      this.data.board.id,
      this.data.column.id,
      this.data.task
    );
  }

  onStatusChange(newStatus: string): void {
    if (newStatus === this.data.task.status) return;

    const board = this.data.board;
    const currentColumn = this.data.column;
    const task = this.data.task;

    const newColumn = board.columns.find((c) => c.name === newStatus);
    if (!newColumn) {
      console.error('Column not found');
      return;
    }

    const originalStatus = task.status;
    task.status = newStatus;

    try {
      this.boardService.moveTask(
        board.id,
        currentColumn.id,
        newColumn.id,
        task.id
      );

      this.data.column = newColumn;
    } catch (error) {
      console.error('Failed to move task:', error);
      task.status = originalStatus;
    }
  }

  private saveChanges(): void {
    if (this.selectedStatus !== this.data.column.id) {
      const newColumn = this.data.board.columns.find(
        (c) => c.id === this.selectedStatus
      );
      if (newColumn) {
        this.boardService.moveTask(
          this.data.board.id,
          this.data.column.id,
          newColumn.id,
          this.data.task.id
        );
      }
    }

    this.boardService.updateTask(
      this.data.board.id,
      this.data.column.id,
      this.data.task
    );
  }

  deleteTask(): void {
    this.dialogRef.close({ delete: true });
  }

  editTask(): void {
    this.dialogRef.close({ edit: true });
  }
}
