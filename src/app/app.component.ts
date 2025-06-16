import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from './core/services/theme/theme.service';
import { BoardService } from './core/services/board.service';
import { Board } from './core/models/board.model';
import { SidebarComponent } from './layout/side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
})
export class AppComponent implements OnInit, OnDestroy {
  isDarkTheme = false;
  selectedBoard: Board | null = null;

  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  private subscriptions = new Subscription();

  constructor(
    private themeService: ThemeService,
    private boardService: BoardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.themeService.isDarkTheme$.subscribe((value) => {
        this.isDarkTheme = value;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.boardService.boards$.subscribe((boards) => {
        if (boards.length > 0) {
          if (
            !this.selectedBoard ||
            !boards.find((b) => b.id === this.selectedBoard?.id)
          ) {
            this.selectedBoard = boards[0];
          }
        } else {
          this.selectedBoard = null;
        }
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onBoardDeleted(): void {}

  onBoardSelected(boardId: string | null): void {
    this.selectedBoard = boardId
      ? this.boardService.getBoard(boardId) || null
      : null;
    this.cdr.detectChanges();
  }

  onToggleSidebar(): void {}
}
