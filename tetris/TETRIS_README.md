# 🟩 Tetris

**Live demo:** [https://sokratgruzit.github.io/games/tetris] (https://sokratgruzit.github.io/games/tetris)

---

## 🕹️ About the game

Tetris — classic puzzle game where the player moves falling tetrominoes and tries to complete full lines to score points.

Control tetrominoes to avoid gaps and clear as many lines as possible.

---

## 💡 Mechanics

Controls:

⏫ Arrow Down — speed up fall
⬅️ A / D — rotate tetromino left / right
⏸️ P — pause / resume

---

```bash

Gameplay:

Tetrominoes fall automatically.

Press Arrow Down to accelerate falling.

Rotate tetrominoes with A / D.

Complete horizontal lines to earn points.

Game ends if blocks reach the top.

```

---

## 🔊 Sounds

Currently, no sounds implemented. Planned:

Line clear

Tetromino landing

Game over

---

## 🎨 Graphics

Tetrominoes are composed of small squares.

Each tetromino moves with a wave animation when falling or rotating.

No sprites yet; all visuals are generated from colored squares.

---

## ⚙️ Technologies

# ECS (Entity-Component-System)

Components — data for each entity (PositionComponent, TetrominoComponent, ColorComponent, TypeComponent, etc.)

Systems — logic updating entities:

    PhysicsSystem — falling, wave motion, horizontal movement

    RenderSystem — draws squares on canvas

    CollisionSystem — detects collisions with floor and blocks

    InputSystem — keyboard control (planned)

    GameStateSystem — spawning new tetrominoes, game over, restart

    AnimationSystem — wave effects for squares (planned)

# EventBus (planned)

Events for game logic (line cleared, score increase, game over)

Decouples systems and allows easy future expansion.

# GameEngine

Custom game loop (update & render) using requestAnimationFrame.

Physics and rendering are separated for smooth motion.

---

## 📦 Project structure

```

tetris/
├─ index.html ← Main page
├─ assets/
│ └─ sounds/ (planned)
├─ src/
│ ├─ game.ts ← Game cicle
│ ├─ ecs/
│ │ ├─ entity.ts
│ │ ├─ components/ ← Components (TetrominoComponent, GameComponent, etc.)
│ │ ├─ entities/ ← Entities factories (game, tetromino)
│ │ └─ systems/ ← Systems (Physics, Render, Collision, Animation, Input, GameState)
│ └─ main.ts
├─ package.json
└─ TETRIS_README.md

```

---

## 🚀 Running locally

```bash

# Clone repository
git clone https://github.com/sokratgruzit/games.git
cd games/flappy-bird

# Install dependencies
npm install

# Start dev server
npm run dev

```

---

## 🎯 Portfolio highlights

ECS architecture for game logic

Tetrominoes built from multiple squares with wave movement

Smooth falling physics with acceleration

Keyboard controls (A/D for rotation, Arrow Down for speed)

Game loop with update/render separation

Game in active development

---

## 🌟 Future plans

Add all tetromino types

Add EventBus and sound effects

Improve animations and visual effects

Complete game UI and menus

🔥 Play right now: [Tetris](https://sokratgruzit.github.io/games/tetris)
