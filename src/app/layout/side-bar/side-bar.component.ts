import { Component, HostBinding, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/core/services/theme/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/models/board.model';
import { CreateBoardModalComponent } from 'src/app/core/modals/create-board-modal/create-board-modal.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() selectedBoardId: string | null = null;
  @Output() boardSelected = new EventEmitter<string>();
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  boards: Board[] = [];
  isDarkTheme = false;
  isSidebarHidden = false;

  private subscriptions = new Subscription();

  constructor(
    private themeService: ThemeService,
    private dialog: MatDialog,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.boardService.boards$.subscribe((boards) => {
        this.boards = boards;

        if (boards.length > 0 && !this.selectedBoardId) {
          this.selectBoard(boards[0].id);
        }
      })
    );

    this.subscriptions.add(
      this.themeService.isDarkTheme$.subscribe((isDark) => {
        this.isDarkTheme = isDark;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostBinding('style.width.px')
  get width() {
    return this.isSidebarHidden ? 0 : 300;
  }

  @HostBinding('class.hidden')
  get hiddenClass() {
    return this.isSidebarHidden;
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
    this.toggleSidebarEvent.emit();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeService.setDarkTheme(this.isDarkTheme);

    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  selectBoard(boardId: string): void {
    this.selectedBoardId = boardId;
    this.boardSelected.emit(boardId);
  }

  isBoardActive(boardId: string): boolean {
    return this.selectedBoardId === boardId;
  }

  openCreateBoardDialog(): void {
    const dialogRef = this.dialog.open(CreateBoardModalComponent, {
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((newBoard: Board | undefined) => {
      if (newBoard) {
        this.selectBoard(newBoard.id);
      }
    });
  }
}
