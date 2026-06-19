import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../services/websocket';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  protected ws = inject(WebsocketService);

  playerName = '';
  roomName   = '';

  miniBoard = [
    ['', '', '', 'p2', '', '', ''],
    ['', 'p1', '', '', 'p2', '', ''],
    ['p1', 'p1', 'p2', 'p1', '', '', ''],
  ];

  onSubmit(): void {
    const name = this.playerName.trim();
    const room = this.roomName.trim();
    if (!name || !room) return;
    this.ws.connect(name, room);
  }
}