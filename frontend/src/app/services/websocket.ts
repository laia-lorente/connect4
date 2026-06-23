import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import {
  WsMessage, WsMessageType,
  GameState, CellValue,
  StatePayload, WinnerPayload, WaitPayload, ErrorPayload,
} from '../models/game';

const ROWS = 6;
const COLS = 7;

function emptyBoard(): CellValue[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {

  private readonly WS_URL = location.hostname === 'localhost'
    ? 'ws://localhost:8000/ws'
    : 'wss://conecta4-backend-rngq.onrender.com/ws';
  private ws: WebSocket | null = null;

  // ── Signals ──
  readonly phase       = signal<GameState['phase']>('login');
  readonly board       = signal<CellValue[][]>(emptyBoard());
  readonly currentTurn = signal<'P1' | 'P2'>('P1');
  readonly players     = signal<GameState['players']>([]);
  readonly winner      = signal<CellValue | 'draw' | null>(null);
  readonly isAiGame    = signal<boolean>(false);
  readonly waitMessage = signal<string>('');
  readonly errorMsg    = signal<string>('');
  readonly myColor     = signal<'P1' | 'P2' | null>(null);
  readonly myName      = signal<string>('');

  // ── Computades ──
  readonly isMyTurn = computed(() =>
    this.myColor() !== null && this.currentTurn() === this.myColor()
  );

  readonly statusText = computed(() => {
    const phase = this.phase();
    if (phase === 'waiting') return this.waitMessage() || 'Esperando rival...';
    if (phase === 'finished') {
      const w = this.winner();
      if (w === 'draw') return '🤝 ¡EMPATE!';
      const winner = this.players().find(p => p.color === w);
      return `🏆 ${winner?.name ?? 'Jugador'} ¡ha ganado!`;
    }
    if (phase === 'playing') {
      const p = this.players().find(p => p.color === this.currentTurn());
      return this.isMyTurn()
        ? `✨ ¡Tu turno, ${this.myName()}!`
        : `⏳ Turno de ${p?.name ?? '...'}`;
    }
    return '';
  });

  // ── Connexió ──
  connect(name: string, room: string): void {
    if (this.ws) this.ws.close();

    this.myName.set(name);
    this.phase.set('waiting');
    this.board.set(emptyBoard());
    this.winner.set(null);
    this.errorMsg.set('');

    this.ws = new WebSocket(this.WS_URL);

    this.ws.onopen = () => {
      this.send({ type: 'join', payload: { name, room } });
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data);
        this.handleMessage(msg);
      } catch {
        console.error('WS parse error', event.data);
      }
    };

    this.ws.onerror = () => {
      this.errorMsg.set('Error de conexión. Comprueba que el servidor está activo.');
      this.phase.set('login');
    };

    this.ws.onclose = () => {
      if (this.phase() === 'playing') {
        this.errorMsg.set('El rival ha abandonado la partida.');
        this.phase.set('finished');
      }
    };
  }

  playVsAi(): void {
    this.send({ type: 'play_vs_ai', payload: {} });
  }

  playAgain(): void {
    this.winner.set(null);
    this.board.set(emptyBoard());
    this.send({ type: 'restart', payload: {} });
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    this.phase.set('login');
    this.board.set(emptyBoard());
    this.winner.set(null);
    this.myColor.set(null);
    this.errorMsg.set('');
  }

  sendMove(column: number): void {
    if (!this.isMyTurn() || this.phase() !== 'playing') return;
    this.send({ type: 'move', payload: { column } });
  }

  private handleMessage(msg: WsMessage): void {
    switch (msg.type as WsMessageType) {
      case 'state': {
        const p = msg.payload as unknown as StatePayload;
        this.board.set(p.board);
        this.currentTurn.set(p.currentTurn);
        this.players.set(p.players);
        this.isAiGame.set(p.isAiGame);
        this.phase.set('playing');
        const me = p.players.find(pl => pl.name === this.myName());
        if (me) this.myColor.set(me.color);
        break;
      }
      case 'winner': {
        const p = msg.payload as unknown as WinnerPayload;
        this.winner.set(p.winner);
        this.phase.set('finished');
        break;
      }
      case 'wait': {
        const p = msg.payload as unknown as WaitPayload;
        this.waitMessage.set(p.message);
        this.phase.set('waiting');
        break;
      }
      case 'error': {
        const p = msg.payload as unknown as ErrorPayload;
        this.errorMsg.set(p.message);
        break;
      }
      case 'opponent_left': {
        this.errorMsg.set('El rival ha abandonado la partida.');
        this.phase.set('finished');
        break;
      }
    }
  }

  private send(msg: WsMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  ngOnDestroy(): void {
    this.ws?.close();
  }
}