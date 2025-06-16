import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from 'src/app/core/modals/edit-modal/edit-modal.component';
import { ViewTaskModalComponent } from 'src/app/core/modals/view-task-modal/view-task-modal.component';
import { Board } from 'src/app/core/models/board.model';
import { Column } from 'src/app/core/models/column.model';
import { Task } from 'src/app/core/models/task.model';
import { BoardService } from 'src/app/core/services/board.service';
import { DeleteTaskModalComponent } from 'src/app/core/modals/delete-task-modal/delete-task-modal.component';
import { EditTaskModalComponent } from 'src/app/core/modals/edit-task-modal/edit-task-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() isDarkTheme: boolean = false;
  @Input() board: Board | null = null;

  @Output() boardChanged = new EventEmitter<Board>();
  @Output() boardUpdated = new EventEmitter<Board>();

  boards: Board[] = [];
  selectedBoard: Board | null = null;

  constructor(private boardService: BoardService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadBoards();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['board'] && changes['board'].currentValue) {
      this.selectedBoard = changes['board'].currentValue;
    }
  }

  get connectedDropLists(): string[] {
    return this.board?.columns.map((_, i) => `taskList-${i}`) ?? [];
  }

  loadBoards(): void {
    this.boards = this.boardService.getBoards();
    if (this.boards.length > 0 && !this.selectedBoard) {
      this.selectedBoard = this.boards[0];
    }
  }

  selectBoard(board: Board): void {
    this.selectedBoard = board;
    this.boardChanged.emit(board);
  }

  onBoardSave(boardData: { name: string; columns: string[] }): void {
    if (!this.board) return;

    const currentColumns = this.board.columns;

    const updatedColumns: Column[] = boardData.columns.map((name, index) => {
      const existing = currentColumns.find((c) => c.name === name);
      return (
        existing || {
          id: this.boardService.generateId(),
          name,
          tasks: [],
        }
      );
    });

    const updatedBoard: Board = {
      ...this.board,
      name: boardData.name,
      columns: updatedColumns,
    };

    this.board = updatedBoard;
    this.boardService.updateBoard(updatedBoard);
    this.boardChanged.emit(updatedBoard);
    this.boardUpdated.emit(updatedBoard);
  }

  addColumn(): void {
    if (!this.board) return;

    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '480px',
      data: {
        boardName: this.board.name,
        columns: this.board.columns.map((col: Column) => col.name),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onBoardSave(result);
      }
    });
  }

  getCompletedSubtasks(task: Task): number {
    return task.subtasks.filter((subtask) => subtask.isCompleted).length;
  }

  getColumnColor(index: number): string {
    const colors = ['#49C4E5', '#8471F2', '#67E2AE', '#FFA500'];
    return colors[index % colors.length];
  }

  openTaskModal(task: Task, column: Column, board: Board): void {
    const dialogRef = this.dialog.open(ViewTaskModalComponent, {
      width: '500px',
      data: {
        board: this.board,
        column: column,
        task: task,
      },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.delete) {
        const dialogRef = this.dialog.open(DeleteTaskModalComponent, {
          width: '500px',
          data: {
            board: this.board,
            column: column,
            task: task,
          },
          panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed();
      } else if (result?.edit) {
        const dialogRef = this.dialog.open(EditTaskModalComponent, {
          width: '500px',
          data: {
            board: this.board,
            column: column,
            task: task,
          },
          panelClass: 'custom-dialog-container',
        });
        dialogRef.afterClosed();
      }
    });
  }

  onColumnDrop(event: CdkDragDrop<Column[]>): void {
    if (!this.board) return;

    moveItemInArray(
      this.board.columns,
      event.previousIndex,
      event.currentIndex
    );
    this.boardService.updateBoard(this.board);
    this.boardUpdated.emit(this.board);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, boardId: string): void {
    if (!this.board) return;

    const fromColumnIndex = parseInt(
      event.previousContainer.id.split('-')[1],
      10
    );
    const toColumnIndex = parseInt(event.container.id.split('-')[1], 10);

    const fromColumn = this.board.columns[fromColumnIndex];
    const toColumn = this.board.columns[toColumnIndex];

    if (!fromColumn || !toColumn) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(toColumn.tasks, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        fromColumn.tasks,
        toColumn.tasks,
        event.previousIndex,
        event.currentIndex
      );

      const task = toColumn.tasks[event.currentIndex];
      this.boardService.updateTaskStatus(
        boardId,
        task.id,
        fromColumn.id,
        toColumn.id
      );
    }

    this.boardService.updateBoard(this.board);
    this.boardUpdated.emit(this.board);
  }
}
