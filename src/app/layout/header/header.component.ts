import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/models/board.model';
import { Column } from '../../core/models/column.model';
import { DeleteModalComponent } from '../../core/modals/delete-modal/delete-modal.component';
import { EditModalComponent } from '../../core/modals/edit-modal/edit-modal.component';
import { AddNewTaskModalComponent } from 'src/app/core/modals/add-new-task-modal/add-new-task-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() boardTitle: string = '';
  @Input() isDarkTheme: boolean = false;
  @Input() board: Board | null = null;
  @Output() boardUpdated = new EventEmitter<Board>();
  @Output() boardDeleted = new EventEmitter<string>();
  @Output() addNewTask = new EventEmitter<void>();

  showBoardOptions = false;

  constructor(
    private elementRef: ElementRef,
    private dialog: MatDialog,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  toggleBoardOptions(event: MouseEvent): void {
    event.stopPropagation();
    this.showBoardOptions = !this.showBoardOptions;
  }

  handleClickOutside = (event: Event): void => {
    if (
      this.showBoardOptions &&
      this.elementRef.nativeElement &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.showBoardOptions = false;
    }
  };

  closeBoardOptions(): void {
    this.showBoardOptions = false;
  }

  get currentColumns(): Column[] {
    return this.board?.columns || [];
  }

  openEditBoardModal(): void {
    this.closeBoardOptions();

    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '480px',
      data: {
        boardName: this.boardTitle,
        columns: this.currentColumns.map((col: Column) => col.name),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onBoardSave(result);
      }
    });
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
    this.boardUpdated.emit(updatedBoard);
  }

  openDeleteBoardModal(): void {
    this.closeBoardOptions();

    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '480px',
      data: { boardName: this.boardTitle },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onBoardDelete();
      }
    });
  }

  onBoardDelete(): void {
    if (!this.board) return;

    this.boardService.deleteBoard(this.board.id);
    this.boardDeleted.emit(this.board.id);
  }

  openAddTaskModal() {
    this.dialog.open(AddNewTaskModalComponent, {
      data: {
        boardId: this.board?.id,
        columns: this.currentColumns.map((col: Column) => col.name),
      },
    });

  }
}
