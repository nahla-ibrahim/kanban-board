import { Component } from '@angular/core';
import { Board } from './pages/board/board';

@Component({
  selector: 'app-root',
  imports: [Board],
  templateUrl: './app.html',
})
export class App {}
