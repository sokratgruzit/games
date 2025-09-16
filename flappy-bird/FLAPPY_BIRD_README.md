# 🐦 Flappy Bird

**Live demo:** [https://sokratgruzit.github.io/games/flappy-bird] (https://sokratgruzit.github.io/games/flappy-bird)

---

## 🕹️ Об игре

Flappy Bird — аркадная игра, где игрок управляет птицей и должен пролететь как можно дальше, избегая столкновений с препятствиями.
Игроку нужно вовремя нажимать на кнопку, чтобы птица взлетала, иначе она падает вниз под действием гравитации.

Задача: набрать максимальное количество очков, пролетая сквозь ряды труб.

---

## 💡 Механика

Управление:

⏫ Пробел — прыжок птицы

⏸️ P — пауза / продолжить игру

После смерти можно начать заново с помощью клавиши "R"

---

```bash

Игровой процесс:

Птица постоянно падает вниз из-за гравитации

Нажатие пробела даёт импульс вверх

Игрок набирает очки, пролетая мимо труб

Столкновение с трубой или землёй вызывает серию анимаций взрывов и завершает игру

```

---

## 🔊 Звуки и музыка

Звуки подключены через SoundManager и управляются событиями:

Подбор частиц / очков — particles.wav

Столкновение птицы — collision.wav

Взрыв — explosion.wav

Кнопка рестарта — restartBtn.wav

Фоновая музыка (bg.mp3) играет в цикле и останавливается при паузе или конце игры

---

## 🎨 Графика

Спрайты:

Птица — dragon.png (JSON со спрайтами для анимации)

Взрыв — explosion.png + explosion.json (кадровая анимация)

Луна — moon.png

Фоны (многослойные, создают эффект параллакса):

far-bg.png

middle-bg.png

near-bg.png

Анимации:

Птица машет крыльями

Взрывы после столкновений (несколько размеров, проигрываются поочередно)

Частицы за птицей (цветные хвосты, зависят от hue)

Параллакс фонов

Эффекты:

Градиентный фон через GradientComponent

Частицы генерируются при каждом движении птицы

Объекты двигаются благодаря PhysicsSystem

---

## ⚙️ Технологии

# ECS (Entity-Component-System)

Архитектура построена на ECS, где каждая игровая сущность — это комбинация компонентов:

Компоненты — данные (PositionComponent, SpriteComponent, ExplosionComponent, GradientComponent, TypeComponent, BoundaryComponent, и т.д.)

Системы — логика, которая обновляет компоненты:

PhysicsSystem — движение и физика

RenderSystem — отрисовка на Canvas

CollisionSystem — проверка столкновений

AnimationSystem — проигрывание спрайтовых анимаций

InputSystem — обработка ввода

GameStateSystem — состояние игры (пауза, конец, рестарт)

Такой подход делает код гибким, читаемым и удобным для расширения.

# EventBus

Все события проходят через шину событий (EventBus):

birdCollision — птица столкнулась

explosionPlay — запуск анимации взрыва

explosionFinished — завершение взрыва

restartGame — перезапуск

scoreIncrease — увеличение очков

gameStart / gameOver — начало и конец игры

EventBus отделяет логику систем от игровых событий, что позволяет легко добавлять новые фичи.

# GameEngine

Собственный игровой цикл (GameEngine) управляет update и render:

update(dt) — обновление всех систем (физика, анимации, столкновения, генерация объектов)

render() — отрисовка всех сущностей и UI

Работает на основе requestAnimationFrame и обеспечивает плавный FPS.

---

## 📦 Структура проекта

```

flappy-bird/
├─ index.html ← Главная страница игры
├─ assets/
│ ├─ sounds/
│ │ ├─ bg.mp3
│ │ ├─ particles.wav
│ │ ├─ collision.wav
│ │ ├─ explosion.wav
│ │ └─ restartBtn.wav
│ └─ sprites/
│   ├─ dragon.png
│   ├─ dragon.json
│   ├─ explosion.png
│   ├─ explosion.json
│   ├─ moon.png
│   ├─ far-bg.png
│   ├─ middle-bg.png
│   └─ near-bg.png
├─ src/
│ ├─ engine.ts ← Игровой цикл
│ ├─ game-controller.ts ← Основной контроллер
│ ├─ ecs/
│ │ ├─ entity.ts
│ │ ├─ components/ ← Компоненты (Position, Sprite, Explosion, Gradient, Boundary, Type и т.д.)
│ │ ├─ entities/ ← Фабрики сущностей (bird, explosion, gradient, moon, image, game)
│ │ └─ systems/ ← Системы (Physics, Render, Collision, Animation, Input, GameState)
│ ├─ managers/
│ │ ├─ particle-manager.ts
│ │ ├─ obstacle-manager.ts
│ │ ├─ input-manager.ts
│ │ ├─ sound-manager.ts
│ │ ├─ event-bus.ts
│ │ └─ ui-manager.ts
│ └─ objects/
│   ├─ dragon.json ← анимации птицы
│   └─ explosion.json ← анимации взрыва
├─ package.json
└─ FLAPPY_BIRD_README.md

```

---

## 🚀 Запуск локально

```bash

# Клонировать репозиторий
git clone https://github.com/sokratgruzit/games.git
cd games/flappy-bird

# Установить зависимости
npm install

# Запустить дев-сервер
npm run dev

```

---

## 🎯 Особенности для портфолио

Архитектура ECS (Entity-Component-System)

Событийная модель через EventBus

Собственный GameEngine

Многослойный параллакс фон

Частицы с динамическим hue

Система анимаций спрайтов

Система взрывов после столкновения

Полностью на TypeScript

HUD и UI через UIManager

Музыка и звуки управляются SoundManager

---

## 🌟 План развития

Добавить разные виды препятствий

Сложность по уровням (ускорение игры)

Таблицы рекордов и лидерборд

Поддержка мобильного управления

Более сложные анимации и эффекты (туман, освещение)

🔥 Играть прямо сейчас: [Flappy Bird](https://sokratgruzit.github.io/games/flappy-bird)
