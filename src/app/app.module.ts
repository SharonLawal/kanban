import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/side-bar/side-bar.component';
import { HeaderComponent } from './layout/header/header.component';
import { EditTaskModalComponent } from './core/modals/edit-task-modal/edit-task-modal.component';
import { DeleteTaskModalComponent } from './core/modals/delete-task-modal/delete-task-modal.component';
import { ViewTaskModalComponent } from './core/modals/view-task-modal/view-task-modal.component';
import { CreateBoardModalComponent } from './core/modals/create-board-modal/create-board-modal.component';
import { DeleteModalComponent } from './core/modals/delete-modal/delete-modal.component';
import { EditModalComponent } from './core/modals/edit-modal/edit-modal.component';
import { BoardComponent } from './layout/board/board.component';
import { AddNewTaskModalComponent } from './core/modals/add-new-task-modal/add-new-task-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    BoardComponent,
    CreateBoardModalComponent,
    DeleteModalComponent,
    EditModalComponent,
    EditTaskModalComponent,
    DeleteTaskModalComponent,
    ViewTaskModalComponent,
    AddNewTaskModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
