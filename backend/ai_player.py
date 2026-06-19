import os
import re
import random
from groq import AsyncGroq
from dotenv import load_dotenv
from game_manager import Board, get_valid_columns, board_to_str

load_dotenv()

client = AsyncGroq(api_key=os.environ["GROQ_API_KEY"])

SYSTEM_PROMPT = """Ets un jugador expert de Conecta 4.
El tauler és de 6 files × 7 columnes. Les fitxes cauen per gravetat.
Jugues amb les fitxes P2. L'oponent juga amb P1.

El tauler es representa així (fila 0 = superior, fila 5 = inferior):
. = buit | P1 = oponent | P2 = tu

La teva tasca:
1. Primer mira si pots guanyar en 1 moviment → juga aquella columna.
2. Si no, bloqueja si l'oponent pot guanyar en 1 moviment.
3. Si no, tria la millor columna estratègicament.

Respon ÚNICAMENT amb un número enter entre 0 i 6 (la columna).
Cap text addicional, cap explicació. Només el número."""


async def get_ai_move(board: Board) -> int:
    """
    Demana a Groq la millor columna per a la IA.
    Si la resposta no és parsejable, tria la columna central disponible.
    """
    valid_cols = get_valid_columns(board)
    if not valid_cols:
        return 0

    board_text = board_to_str(board)
    valid_str = ", ".join(str(c) for c in valid_cols)

    user_msg = (
        f"Estat actual del tauler:\n{board_text}\n\n"
        f"Columnes vàlides: {valid_str}\n"
        f"Quina columna tries?"
    )

    try:
        response = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": user_msg},
            ],
            max_tokens=5,
            temperature=0.2,
        )
        text = response.choices[0].message.content.strip()
        match = re.search(r"\d", text)
        if match:
            col = int(match.group())
            if col in valid_cols:
                return col
    except Exception as e:
        print(f"[Groq error] {e}")

    # Fallback: prefereix la columna central
    center = [c for c in [3, 2, 4, 1, 5, 0, 6] if c in valid_cols]
    return center[0] if center else random.choice(valid_cols)