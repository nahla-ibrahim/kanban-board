import { Component, signal } from '@angular/core';
import { Board } from "./pages/board/board";

@Component({
  selector: 'app-root',
  imports: [Board],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('kanban-board');
  
}
