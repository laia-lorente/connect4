export type CellValue = null | 'P1' | 'P2';
export type GamePhase = 'login' | 'waiting' | 'playing' | 'finished';

export interface Player {
  id: string;
  name: string;
  color: 'P1' | 'P2';
}

export interface GameState {
  board: CellValue[][];
  currentTurn: 'P1' | 'P2';
  players: Player[];
  winner: CellValue | 'draw' | null;
  phase: GamePhase;
  isAiGame: boolean;
}

// ── Missatges WebSocket ──
export type WsMessageType =
  | 'join'
  | 'move'
  | 'play_vs_ai'
  | 'restart'
  | 'state'
  | 'winner'
  | 'wait'
  | 'error'
  | 'opponent_left';

export interface WsMessage {
  type: WsMessageType;
  payload: Record<string, unknown>;
}

export interface JoinPayload    { name: string; room: string; }
export interface MovePayload    { column: number; }
export interface StatePayload   {
  board: CellValue[][];
  currentTurn: 'P1' | 'P2';
  players: Player[];
  isAiGame: boolean;
}
export interface WinnerPayload  { winner: CellValue | 'draw'; }
export interface WaitPayload    { message: string; }
export interface ErrorPayload   { message: string; }