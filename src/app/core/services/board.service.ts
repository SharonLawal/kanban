import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly STORAGE_KEY = 'kanban-boards';
  private boardsSubject: BehaviorSubject<Board[]>;
  private readonly DEFAULT_BOARDS: Board[] = [
    {
      id: '1',
      name: 'Platform Launch',
      columns: [
        {
          id: '1-1',
          name: 'Todo',
          tasks: [
            {
              id: '1-1-1',
              title: 'Build UI for onboarding flow',
              description:
                'Design and implement the initial onboarding screens for new users.',
              status: 'Todo',
              subtasks: [
                { id: '1-1-1-1', title: 'Sign up page', isCompleted: false },
                { id: '1-1-1-2', title: 'Sign in page', isCompleted: false },
                { id: '1-1-1-3', title: 'Welcome page', isCompleted: false },
              ],
            },
            {
              id: '1-1-2',
              title: 'Build UI for search',
              description:
                'Create the interface for search functionality across the platform.',
              status: 'Todo',
              subtasks: [
                { id: '1-1-2-1', title: 'Search page', isCompleted: false },
              ],
            },
            {
              id: '1-1-3',
              title: 'Build settings UI',
              description:
                'Develop the user interface for managing account and billing settings.',
              status: 'Todo',
              subtasks: [
                { id: '1-1-3-1', title: 'Account page', isCompleted: false },
                { id: '1-1-3-2', title: 'Billing page', isCompleted: false },
              ],
            },
            {
              id: '1-1-4',
              title: 'QA and test all major user journeys',
              description:
                'Conduct thorough testing on all user journeys to ensure functionality.',
              status: 'Todo',
              subtasks: [
                { id: '1-1-4-1', title: 'Testing plan', isCompleted: false },
                { id: '1-1-4-2', title: 'Test cases', isCompleted: false },
              ],
            },
            {
              id: '1-1-5',
              title: 'Add search endpoints',
              description:
                'Develop and expose backend endpoints to support search queries.',
              status: 'Todo',
              subtasks: [
                { id: '1-1-5-1', title: 'Search API', isCompleted: true },
                { id: '1-1-5-2', title: 'Search filters', isCompleted: false },
              ],
            },
            {
              id: '1-1-6',
              title: 'Add authentication endpoints',
              description:
                'Implement API endpoints to handle user authentication securely.',
              status: 'Todo',
              subtasks: [
                { id: '1-1-6-1', title: 'Auth API', isCompleted: true },
                {
                  id: '1-1-6-2',
                  title: 'User permissions',
                  isCompleted: false,
                },
              ],
            },
            {
              id: '1-1-7',
              title:
                'Research pricing points of various competitors and trial different business models',
              description:
                'Analyze the pricing strategies of competitors and test alternatives.',
              status: 'Todo',
              subtasks: [
                {
                  id: '1-1-7-1',
                  title: 'Competitor analysis',
                  isCompleted: true,
                },
                {
                  id: '1-1-7-2',
                  title: 'Pricing model research',
                  isCompleted: false,
                },
                {
                  id: '1-1-7-3',
                  title: 'Revenue projections',
                  isCompleted: false,
                },
              ],
            },
          ],
        },
        {
          id: '1-2',
          name: 'Doing',
          tasks: [
            {
              id: '1-2-1',
              title: 'Design settings and search pages',
              description:
                'Create UI/UX designs for the settings and search functionalities.',
              status: 'Doing',
              subtasks: [
                {
                  id: '1-2-1-1',
                  title: 'Settings page design',
                  isCompleted: true,
                },
                {
                  id: '1-2-1-2',
                  title: 'Search page design',
                  isCompleted: false,
                },
                { id: '1-2-1-3', title: 'User feedback', isCompleted: false },
              ],
            },
            {
              id: '1-2-2',
              title: 'Add account management endpoints',
              description:
                'Develop APIs to support account profile management.',
              status: 'Doing',
              subtasks: [
                { id: '1-2-2-1', title: 'User profile API', isCompleted: true },
                {
                  id: '1-2-2-2',
                  title: 'Account settings API',
                  isCompleted: true,
                },
                {
                  id: '1-2-2-3',
                  title: 'Password reset API',
                  isCompleted: false,
                },
              ],
            },
            {
              id: '1-2-3',
              title: 'Design onboarding flow',
              description:
                'Sketch out the onboarding process for a new user experience.',
              status: 'Doing',
              subtasks: [
                { id: '1-2-3-1', title: 'Wireframes', isCompleted: true },
                { id: '1-2-3-2', title: 'User flow', isCompleted: false },
                { id: '1-2-3-3', title: 'Prototype', isCompleted: false },
              ],
            },
          ],
        },
        {
          id: '1-3',
          name: 'Done',
          tasks: [
            {
              id: '1-3-1',
              title: 'Conduct 5 wireframe tests',
              description:
                'Perform usability testing on wireframes with a small test group.',
              status: 'Done',
              subtasks: [
                { id: '1-3-1-1', title: 'Complete 5 tests', isCompleted: true },
              ],
            },
            {
              id: '1-3-2',
              title: 'Create wireframe prototype',
              description:
                'Develop interactive wireframes for early-stage feedback.',
              status: 'Done',
              subtasks: [
                { id: '1-3-2-1', title: 'Create prototype', isCompleted: true },
              ],
            },
            {
              id: '1-3-3',
              title: 'Review results of usability tests and iterate',
              description:
                'Analyze feedback from tests and refine product design.',
              status: 'Done',
              subtasks: [
                { id: '1-3-3-1', title: 'Analyze results', isCompleted: true },
                {
                  id: '1-3-3-2',
                  title: 'Identify improvements',
                  isCompleted: true,
                },
                { id: '1-3-3-3', title: 'Update designs', isCompleted: true },
              ],
            },
            {
              id: '1-3-4',
              title:
                'Create paper prototypes and conduct 10 usability tests with potential customers',
              description:
                'Build and test low-fidelity paper prototypes with users.',
              status: 'Done',
              subtasks: [
                {
                  id: '1-3-4-1',
                  title: 'Create prototypes',
                  isCompleted: true,
                },
                { id: '1-3-4-2', title: 'Conduct tests', isCompleted: true },
              ],
            },
            {
              id: '1-3-5',
              title: 'Market discovery',
              description:
                'Explore market needs and identify potential target segments.',
              status: 'Done',
              subtasks: [
                { id: '1-3-5-1', title: 'Market research', isCompleted: true },
              ],
            },
            {
              id: '1-3-6',
              title: 'Competitor analysis',
              description:
                'Study competing products to identify opportunities and threats.',
              status: 'Done',
              subtasks: [
                {
                  id: '1-3-6-1',
                  title: 'Competitor research',
                  isCompleted: true,
                },
                { id: '1-3-6-2', title: 'SWOT analysis', isCompleted: true },
              ],
            },
            {
              id: '1-3-7',
              title: 'Research the market',
              description: 'Investigate market trends and customer behaviors.',
              status: 'Done',
              subtasks: [
                { id: '1-3-7-1', title: 'Market trends', isCompleted: true },
                { id: '1-3-7-2', title: 'Customer needs', isCompleted: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Marketing Plan',
      columns: [
        { id: '2-1', name: 'Todo', tasks: [] },
        { id: '2-2', name: 'Doing', tasks: [] },
        { id: '2-3', name: 'Done', tasks: [] },
      ],
    },
    {
      id: '3',
      name: 'Roadmap',
      columns: [
        { id: '3-1', name: 'Todo', tasks: [] },
        { id: '3-2', name: 'Doing', tasks: [] },
        { id: '3-3', name: 'Done', tasks: [] },
      ],
    },
  ];

  constructor() {
    const storedBoards = localStorage.getItem(this.STORAGE_KEY);
    const initialBoards = storedBoards
      ? JSON.parse(storedBoards)
      : this.DEFAULT_BOARDS;
    this.boardsSubject = new BehaviorSubject<Board[]>(initialBoards);

    if (!storedBoards) {
      this.saveBoards(initialBoards);
    }
  }

  get boards$(): Observable<Board[]> {
    return this.boardsSubject.asObservable();
  }

  getBoards(): Board[] {
    return this.boardsSubject.getValue();
  }

  getBoard(id: string): Board | undefined {
    return this.getBoards().find((board) => board.id === id);
  }

  getColumns(boardId: string): Column[] {
    const board = this.getBoard(boardId);
    return board ? board.columns : [];
  }

  private saveBoards(boards: Board[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(boards));
    this.boardsSubject.next(boards);
  }

  public generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  createBoard(boardData: Omit<Board, 'id'>): Board {
    const boards = this.getBoards();
    const newBoard: Board = {
      ...boardData,
      columns: boardData.columns || [],
      id: this.generateId(),
    };
    const updatedBoards = [...boards, newBoard];
    this.saveBoards(updatedBoards);
    return newBoard;
  }

  updateBoard(updatedBoard: Board): void {
    const boards = this.getBoards();
    const index = boards.findIndex((b) => b.id === updatedBoard.id);
    if (index !== -1) {
      boards[index] = updatedBoard;
      this.saveBoards([...boards]);
    }
  }

  deleteBoard(id: string): void {
    const boards = this.getBoards().filter((board) => board.id !== id);
    this.saveBoards(boards);
  }

  addColumn(boardId: string, columnName: string): void {
    const boards = this.getBoards();
    const boardIndex = boards.findIndex((b) => b.id === boardId);

    if (boardIndex !== -1) {
      const newColumn: Column = {
        id: Date.now().toString(),
        name: columnName,
        tasks: [],
      };
      boards[boardIndex].columns.push(newColumn);

      this.saveBoards(boards);
    }
  }

  addTask(boardId: string, status: string, task: Omit<Task, 'id'>): void {
    const boards = this.getBoards();
    const board = boards.find((b) => b.id === boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    const column = board.columns.find((c) => c.name === status);
    if (!column) {
      throw new Error(`Column with status "${status}" not found`);
    }

    const newTask: Task = {
      ...task,
      id: this.generateId(),
      status: status,
    };

    column.tasks.push(newTask);
    this.saveBoards(boards);
  }

  updateTask(boardId: string, columnId: string, updatedTask: Task): void {
    const boards = this.getBoards();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    const column = board.columns.find((c) => c.id === columnId);
    if (!column) return;

    const taskIndex = column.tasks.findIndex((t) => t.id === updatedTask.id);
    if (taskIndex !== -1) {
      column.tasks[taskIndex] = updatedTask;
      this.saveBoards(boards);
    }
  }

  deleteTask(boardId: string, columnId: string, taskId: string): void {
    const boards = this.getBoards();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    const column = board.columns.find((c) => c.id === columnId);
    if (!column) return;

    column.tasks = column.tasks.filter((t) => t.id !== taskId);
    this.saveBoards(boards);
  }

  moveTask(
    boardId: string,
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ): void {
    const boards = this.getBoards();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    const fromColumn = board.columns.find((c) => c.id === fromColumnId);
    const toColumn = board.columns.find((c) => c.id === toColumnId);
    if (!fromColumn || !toColumn) return;

    const taskIndex = fromColumn.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = fromColumn.tasks.splice(taskIndex, 1);
    task.status = toColumn.name;
    toColumn.tasks.push(task);

    this.saveBoards(boards);
  }

  renameColumn(boardId: string, columnId: string, newName: string): void {
    const boards = this.getBoards();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    const column = board.columns.find((c) => c.id === columnId);
    if (column) {
      column.name = newName;
      this.saveBoards(boards);
    }
  }

  deleteColumn(boardId: string, columnId: string): void {
    const boards = this.getBoards();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    board.columns = board.columns.filter((c) => c.id !== columnId);
    this.saveBoards(boards);
  }

  toggleSubtask(
    boardId: string,
    columnId: string,
    taskId: string,
    subtaskId: string
  ): void {
    const boards = this.getBoards();
    const board = boards.find((b) => b.id === boardId);
    const column = board?.columns.find((c) => c.id === columnId);
    const task = column?.tasks.find((t) => t.id === taskId);
    const subtask = task?.subtasks.find((st) => st.id === subtaskId);

    if (subtask) {
      subtask.isCompleted = !subtask.isCompleted;
      this.saveBoards(boards);
    }
  }

  getTask(boardId: string, columnId: string, taskId: string): Task | undefined {
    const board = this.getBoard(boardId);
    const column = board?.columns.find((c) => c.id === columnId);
    return column?.tasks.find((t) => t.id === taskId);
  }

  reorderColumns(boardId: string, newOrder: Column[]): void {
    const boards = this.getBoards();
    const boardIndex = boards.findIndex((b) => b.id === boardId);

    if (boardIndex !== -1) {
      boards[boardIndex].columns = newOrder;
      this.saveBoards(boards);
    }
  }

  updateTaskStatus(
    boardId: string,
    taskId: string,
    fromColumnId: string,
    toColumnId: string
  ): void {
    const boards = this.getBoards();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    const fromColumn = board.columns.find((c) => c.id === fromColumnId);
    const toColumn = board.columns.find((c) => c.id === toColumnId);
    if (!fromColumn || !toColumn) return;

    const taskIndex = toColumn.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    toColumn.tasks[taskIndex].status = toColumn.name;

    this.saveBoards(boards);
  }
}
