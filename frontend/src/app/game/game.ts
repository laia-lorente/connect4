import { Component, inject, signal, computed } from '@angular/core';
import { WebsocketService } from '../services/websocket';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent {
  protected ws = inject(WebsocketService);

  readonly cols = [0, 1, 2, 3, 4, 5, 6];
  readonly hoveredCol = signal(-1);

  readonly p1Name = computed(() =>
    this.ws.players().find(p => p.color === 'P1')?.name ?? 'Jugador 1'
  );
  readonly p2Name = computed(() =>
    this.ws.players().find(p => p.color === 'P2')?.name ?? (this.ws.isAiGame() ? 'IA ✦' : 'Jugador 2')
  );

  getCell(row: number, col: number) {
    return this.ws.board()[row][col];
  }

  onColumnClick(col: number): void {
    this.ws.sendMove(col);
  }

  playVsAi(): void {
    this.ws.playVsAi();
  }

  playAgain(): void {
    this.ws.playAgain();
  }

  goHome(): void {
    this.ws.disconnect();
  }
}