# 🎮 Conecta 4 

![kawaii](https://img.shields.io/badge/♥_kawaii_pixel_art_♥-c5b9f0?style=for-the-badge&logoColor=2d1b6e)
![websocket](https://img.shields.io/badge/☆_real--time_websockets_☆-f4b8d4?style=for-the-badge&logoColor=2d1b6e)
![ai](https://img.shields.io/badge/✦_AI_opponent_✦-b8e8d4?style=for-the-badge&logoColor=2d1b6e)

> Juego multijugador en tiempo real de Conecta 4 con WebSockets, oponente IA vía Groq y una estética pixel-art pastel inspirada en las tarjetas de memoria de los videojuegos retro.

🎮 **Demo en vivo:** [conecta4-frontend.onrender.com](https://conecta4-frontend.onrender.com)  
🔧 **Backend API:** [conecta4-backend.onrender.com](https://conecta4-backend.onrender.com)  
📁 **Repositorio:** [github.com/mee96/juego-conecta-4](https://github.com/mee96/juego-conecta-4)

---

## ✦ Funcionalidades

- **PvP en tiempo real** — dos jugadores se conectan al mismo código de sala y juegan en vivo vía WebSockets
- **Oponente IA** — si estás sola en la sala, puedes jugar contra una IA impulsada por el modelo `llama-3.1-8b-instant` de Groq
- **Sin login** — solo un nombre de usuario y un código de sala, y ya estás dentro
- **Diseño responsive** — jugable en escritorio y móvil, toca cualquier punto de la columna para soltar tu ficha
- **UI kawaii pixel-art** — fondo de tablero de ajedrez pastel, fuente Press Start 2P, corazones y estrellas animados, inspirado en las tarjetas de memoria de consolas retro

---

## ✦ Stack tecnológico

### Frontend

![Angular](https://img.shields.io/badge/Angular_19-c5b9f0?style=for-the-badge&logo=angular&logoColor=2d1b6e)
![TypeScript](https://img.shields.io/badge/TypeScript-b8e8d4?style=for-the-badge&logo=typescript&logoColor=2d1b6e)
![WebSocket](https://img.shields.io/badge/WebSocket-f4b8d4?style=for-the-badge&logo=socketdotio&logoColor=2d1b6e)
![CSS3](https://img.shields.io/badge/CSS3-f0e4a0?style=for-the-badge&logo=css3&logoColor=2d1b6e)
![Render](https://img.shields.io/badge/Render-a8c4f0?style=for-the-badge&logo=render&logoColor=2d1b6e)

### Backend

![FastAPI](https://img.shields.io/badge/FastAPI-b8e8d4?style=for-the-badge&logo=fastapi&logoColor=2d1b6e)
![Python](https://img.shields.io/badge/Python-c5b9f0?style=for-the-badge&logo=python&logoColor=2d1b6e)
![Groq](https://img.shields.io/badge/Groq_LLM-f4b8d4?style=for-the-badge&logo=groq&logoColor=2d1b6e)
![Uvicorn](https://img.shields.io/badge/Uvicorn-f0e4a0?style=for-the-badge&logo=gunicorn&logoColor=2d1b6e)
![Render](https://img.shields.io/badge/Render-a8c4f0?style=for-the-badge&logo=render&logoColor=2d1b6e)

---

## ✦ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENTE                          │
│                                                         │
│  LoginComponent  ──►  WebsocketService  ──►  GameComponent │
│  (sala + nombre)      (signals estado)     (tablero 6×7) │
└───────────────────────────┬─────────────────────────────┘
                            │  WebSocket (wss://)
┌───────────────────────────▼─────────────────────────────┐
│                        SERVIDOR                         │
│                                                         │
│  FastAPI /ws  ──►  ConnectionManager  ──►  GameManager  │
│                    (salas/jugadores)    (lógica/victoria)│
│                            │                            │
│                            ▼                            │
│                        Groq SDK                         │
│                  (movimiento IA si 1 jugador)           │
└─────────────────────────────────────────────────────────┘
```

### Protocolo de mensajes WebSocket

```typescript
// Cliente → Servidor
{ type: 'join',       payload: { name: string, room: string } }
{ type: 'move',       payload: { column: number } }
{ type: 'play_vs_ai', payload: {} }

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
       ┌──────┴──────┐
       │             │
  llega rival   "Jugar contra IA"
    humano           │
       │             │
       └──────┬──────┘
              ▼
        Partida iniciada
              │
        ┌─────┴─────┐
        │           │
       PvP        vs IA
   (2 pestañas)  (Groq LLM)
              │
              ▼
       Victoria / Empate
              │
              ▼
    Volver a jugar / Menú
```

---

## ✦ Estructura del proyecto

```
juego-conecta-4/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── models/
│       │   │   └── game.ts        # Interfaces y tipos TypeScript
│       │   ├── services/
│       │   │   └── websocket.ts  # WebSocket + estado con signals
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
│       ├── styles.css                    # Tokens globales y tema pixel-art
│       └── index.html
└── backend/
    ├── main.py                           # App FastAPI + endpoint WebSocket
    ├── connection_manager.py             # Gestión de salas y jugadores
    ├── game_manager.py                   # Lógica del tablero y detección de victoria
    ├── ai_player.py                      # Integración Groq SDK
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
# Servidor en http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
ng serve
# App en http://localhost:4200
```

> **Nota:** asegúrate de que el backend esté corriendo antes de abrir el frontend. Consigue una API key gratuita de Groq en [console.groq.com](https://console.groq.com).

---

## ✦ Despliegue

| Servicio | Plataforma | Configuración |
|---|---|---|
| Backend | Render Web Service | Root dir: `backend` · Start: `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Frontend | Render Static Site | Root dir: `frontend` · Build: `npm install && ng build` · Publish: `dist/frontend/browser` |

Variables de entorno configuradas en el dashboard de Render (nunca en git):
- `GROQ_API_KEY`

---

## ✦ Lo que he aprendido

- Implementar **comunicación bidireccional en tiempo real** con WebSockets tanto en FastAPI (async) como en Angular
- Gestionar el **estado reactivo de la UI** exclusivamente con Angular Signals — sin RxJS, sin NgRx
- Integrar un **LLM como oponente de juego** vía Groq SDK con un prompt estructurado que devuelve un único número de columna
- Diseñar un **sistema multijugador basado en salas** donde el servidor detecta el número de jugadores y cambia dinámicamente entre modo PvP y modo IA
- Desplegar una **aplicación WebSocket full-stack** en Render, gestionando `ws://` → `wss://` y configuración de CORS

---

## ✦ Autora

**Carme Medina Canalda**  
Junior Full Stack Developer · Barcelona  
[github.com/mee96](https://github.com/mee96)

