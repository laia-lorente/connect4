<div align="center">

# ✨ Conecta 4 ✨

![cute](https://img.shields.io/badge/♥_cute_pastel_♥-FFB6D9?style=for-the-badge)
![neon](https://img.shields.io/badge/☆_neon_glow_☆-D4BBFF?style=for-the-badge)
![realtime](https://img.shields.io/badge/✦_real--time_✦-B8F0D8?style=for-the-badge)

**Juego multijugador en tiempo real de Conecta 4**
con WebSockets, oponente IA vía Groq y una estética **cute pastel/neon** con estilo redondito 🩷

[Demo en vivo](https://conecta4-frontend.onrender.com) · [Backend API](https://conecta4-backend.onrender.com) · [Repositorio](https://github.com/laia-lorente/connect4)

</div>

---

## ✦ Funcionalidades

| | |
|---|---|
| 🎮 **PvP en tiempo real** | Dos jugadores se conectan al mismo código de sala y juegan en vivo vía WebSockets |
| 🤖 **Oponente IA** | Si estás sola en la sala, puedes jugar contra una IA impulsada por Groq (`llama-3.1-8b-instant`) |
| 🔁 **Volver a jugar** | Al terminar la partida, puedes reintentar en la misma sala sin volver al lobby |
| 📱 **Responsive** | Jugable en escritorio y móvil |
| 🎨 **UI cute pastel/neon** | Colores pasteles con acentos neón, bordes redondos, glows y animaciones suaves |

---

## ✦ Stack tecnológico

<div align="center">

**Frontend**

![Angular](https://img.shields.io/badge/Angular_21-FF69B4?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-00D4FF?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-D4BBFF?style=for-the-badge&logo=css3&logoColor=white)

**Backend**

![FastAPI](https://img.shields.io/badge/FastAPI-39FF14?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-FFE55C?style=for-the-badge&logo=python&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_LLM-FFB6D9?style=for-the-badge&logo=groq&logoColor=white)

</div>

---

## ✦ Arquitectura

```
┌──────────────────────────────────────────────────────┐
│                     CLIENTE                          │
│                                                      │
│  LoginComponent ──► WebsocketService ──► GameComponent│
│  (sala + nombre)     (signals estado)    (tablero 6×7)│
└─────────────────────────┬────────────────────────────┘
                          │  WebSocket (ws://)
┌─────────────────────────▼────────────────────────────┐
│                     SERVIDOR                         │
│                                                      │
│  FastAPI /ws ──► ConnectionManager ──► GameManager   │
│                  (salas/jugadores)   (lógica/victoria)│
│                          │                           │
│                          ▼                           │
│                      Groq SDK                        │
│                 (movimiento IA si 1 jugador)         │
└──────────────────────────────────────────────────────┘
```

### Mensajes WebSocket

```typescript
// Cliente → Servidor
{ type: 'join',       payload: { name: string, room: string } }
{ type: 'move',       payload: { column: number } }
{ type: 'play_vs_ai', payload: {} }
{ type: 'restart',    payload: {} }

// Servidor → Cliente
{ type: 'state',         payload: { board, currentTurn, players, isAiGame } }
{ type: 'winner',        payload: { winner: 'P1' | 'P2' | 'draw' } }
{ type: 'wait',          payload: { message: string } }
{ type: 'opponent_left', payload: {} }
{ type: 'error',         payload: { message: string } }
```

---

## ✦ Flujo del juego

```
        Introduce nombre + código de sala
                      │
                      ▼
              Pantalla de espera
              ┌───────┴───────┐
              │               │
         llega rival     "Jugar contra IA"
           humano              │
              │               │
              └───────┬───────┘
                      ▼
               Partida iniciada
                      │
                ┌─────┴─────┐
                │           │
               PvP       vs IA
          (2 pestañas) (Groq LLM)
                      │
                      ▼
             Victoria / Empate
                      │
                      ▼
          Volver a jugar / Salir
```

---

## ✦ Estructura del proyecto

```
connect4/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── models/
│       │   │   └── game.ts            # Interfaces y tipos
│       │   ├── services/
│       │   │   └── websocket.ts       # WebSocket + estado
│       │   ├── login/
│       │   │   ├── login.ts
│       │   │   ├── login.html
│       │   │   └── login.css
│       │   ├── game/
│       │   │   ├── game.ts
│       │   │   ├── game.html
│       │   │   └── game.css
│       │   ├── app.ts
│       │   ├── app.html
│       │   └── app.config.ts
│       ├── styles.css                 # Tokens globales pastel/neon
│       └── index.html
└── backend/
    ├── main.py                        # FastAPI + WebSocket endpoint
    ├── connection_manager.py          # Salas y jugadores
    ├── game_manager.py                # Lógica del tablero
    ├── ai_player.py                   # Integración Groq
    └── requirements.txt
```

---

## ✦ Ejecutar en local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Crear fichero .env
echo "GROQ_API_KEY=tu_key_aqui" > .env

uvicorn main:app --reload
# → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
ng serve
# → http://localhost:4200
```

> Consigue una API key gratuita de Groq en [console.groq.com](https://console.groq.com).

---

## ✦ Despliegue

| Servicio | Plataforma | Configuración |
|---|---|---|
| Backend | Render Web Service | Root: `backend` · Start: `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Frontend | Render Static Site | Root: `frontend` · Build: `npm install && ng build` · Publish: `dist/frontend/browser` |

Variable de entorno en Render: `GROQ_API_KEY`

---

## ✦ Autora

**Laia Lorenate**
[github.com/laia-lorente](https://github.com/laia-lorente)
