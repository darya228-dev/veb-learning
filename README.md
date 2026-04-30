# veb-learning
Web development project (Frontend + Backend)

---

## Опис проєкту
 
Проєкт складається з двох частин:

- **Backend** (Node.js + Express + TypeScript + SQLite)
- **Frontend** (JS + HTML + CSS)

Взаємодія між частинами здійснюється через REST API.

---

## Технології

### Backend:
- Node.js
- Express
- TypeScript
- SQLite
- CORS

### Frontend:
- HTML
- CSS
- JavaScript (ES6)
- Fetch API

---

## Запуск проєкту

У першому терміналі:

```bash
npm run dev:be
```

У другому терміналі:

```bash
npm run dev:fe
```

- frontend: `http://localhost:5173`
- backend: `http://localhost:3000`

## API
Tasks
GET /api/v1/tasks
GET /api/v1/tasks/:id
POST /api/v1/tasks
PUT /api/v1/tasks/:id
DELETE /api/v1/tasks/:id


## Функціонал фронтенду
Створення задач
Редагування задач
Видалення задач
Фільтрація (status, priority)
Сортування таблиці
Валідація форми
Обробка помилок API
Стани:
loading
success
error
empty
## CORS

Дозволено тільки:

http://127.0.0.1:5173

## Структура

backend/
frontend/