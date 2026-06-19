from __future__ import annotations
from dataclasses import dataclass, field
from fastapi import WebSocket
from game_manager import Board, empty_board


@dataclass
class Player:
    ws: WebSocket
    name: str
    color: str  # "P1" | "P2"

    def to_dict(self) -> dict:
        return {"id": self.color, "name": self.name, "color": self.color}


@dataclass
class Room:
    players: list[Player] = field(default_factory=list)
    board: Board = field(default_factory=empty_board)
    current_turn: str = "P1"
    is_ai_game: bool = False
    finished: bool = False

    def is_full(self) -> bool:
        return len(self.players) >= 2

    def reset(self) -> None:
        self.board = empty_board()
        self.current_turn = "P1"
        self.finished = False

    def get_player_by_ws(self, ws: WebSocket) -> Player | None:
        return next((p for p in self.players if p.ws is ws), None)

    def players_dict(self) -> list[dict]:
        return [p.to_dict() for p in self.players]

    def state_payload(self) -> dict:
        return {
            "board": self.board,
            "currentTurn": self.current_turn,
            "players": self.players_dict(),
            "isAiGame": self.is_ai_game,
        }


class ConnectionManager:
    def __init__(self) -> None:
        self._rooms: dict[str, Room] = {}

    def get_or_create_room(self, room_id: str) -> Room:
        if room_id not in self._rooms:
            self._rooms[room_id] = Room()
        return self._rooms[room_id]

    def get_room(self, room_id: str) -> Room | None:
        return self._rooms.get(room_id)

    async def disconnect(self, ws: WebSocket, room_id: str) -> None:
        room = self._rooms.get(room_id)
        if not room:
            return

        room.players = [p for p in room.players if p.ws is not ws]

        # Avisa l'oponent si n'hi ha
        for p in room.players:
            try:
                await p.ws.send_json({
                    "type": "opponent_left",
                    "payload": {},
                })
            except Exception:
                pass

        # Neteja la sala si està buida
        if not room.players:
            self._rooms.pop(room_id, None)

    async def broadcast(self, room: Room, message: dict) -> None:
        for player in room.players:
            try:
                await player.ws.send_json(message)
            except Exception:
                pass

    async def send_to(self, ws: WebSocket, message: dict) -> None:
        try:
            await ws.send_json(message)
        except Exception:
            pass