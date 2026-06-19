from typing import Optional

ROWS = 6
COLS = 7

Board = list[list[Optional[str]]]  # "P1" | "P2" | None


def empty_board() -> Board:
    return [[None] * COLS for _ in range(ROWS)]


def drop_piece(board: Board, col: int, player: str) -> Optional[int]:
    """
    Insereix la fitxa a la columna indicada.
    Les fitxes cauen per gravetat (de baix cap amunt).
    Retorna la fila on ha caigut, o None si la columna és plena.
    """
    for row in range(ROWS - 1, -1, -1):
        if board[row][col] is None:
            board[row][col] = player
            return row
    return None


def check_winner(board: Board, row: int, col: int) -> Optional[str]:
    """
    Mira les 4 direccions possibles des de la fitxa que acaba de caure.
    """
    player = board[row][col]
    if player is None:
        return None

    directions = [
        (0, 1),   # horitzontal →
        (1, 0),   # vertical ↓
        (1, 1),   # diagonal ↘
        (1, -1),  # diagonal ↙
    ]

    for dr, dc in directions:
        count = 1
        for sign in (1, -1):
            r, c = row + dr * sign, col + dc * sign
            while 0 <= r < ROWS and 0 <= c < COLS and board[r][c] == player:
                count += 1
                r += dr * sign
                c += dc * sign
        if count >= 4:
            return player

    return None


def is_draw(board: Board) -> bool:
    return all(board[0][c] is not None for c in range(COLS))


def get_valid_columns(board: Board) -> list[int]:
    return [c for c in range(COLS) if board[0][c] is None]


def board_to_str(board: Board) -> str:
    """Serialitza el tauler a text per enviar-lo a Groq."""
    rows = []
    for row in board:
        rows.append(" ".join(cell if cell else "." for cell in row))
    return "\n".join(rows)