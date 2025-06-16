import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardService } from '../../services/board.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-new-task-modal',
  templateUrl: './add-new-task-modal.component.html',
  styleUrls: ['./add-new-task-modal.component.scss']
})
export class AddNewTaskModalComponent {
  taskForm: FormGroup;
  statusOptions: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddNewTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boardId: string, columns: string },
    private boardService: BoardService
  ) {
    this.statusOptions = data.columns;
    
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      subtasks: this.fb.array([
        this.createSubtask('')
      ]),
      status: ['', [Validators.required]]
    });
  }

  createSubtask(title: string = '') {
    return this.fb.group({
      title: [title, [Validators.required]],
      isCompleted: [false]
    });
  }

  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(this.createSubtask());
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  onSubmit() {
  try {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;
    const newTask: Omit<Task, 'id'> = {
      title: formValue.title,
      description: formValue.description,
      status: formValue.status,
      subtasks: formValue.subtasks.map((subtask: any) => ({
        title: subtask.title,
        isCompleted: subtask.isCompleted || false
      }))
    };

    this.boardService.addTask(this.data.boardId, formValue.status, newTask);
    this.dialogRef.close({ taskAdded: true });
  } catch (error) {
    console.error('Error adding task:', error);
  }
}
}