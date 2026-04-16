# Backend API (TypeScript + SQLite)

## Опис проєкту

Проєкт реалізує REST API на Node.js та TypeScript з використанням SQLite як реляційної бази даних.

Система підтримує:
- CRUD операції для сутностей tasks, users, projects
- зв’язки між таблицями (1:N)
- агрегаційні запити
- JOIN запити
- базову валідацію та обробку помилок
- централізовану роботу з базою даних через окремий data-access шар

---

## Схема бази даних

### users
- id (TEXT, PRIMARY KEY)
- name (TEXT, NOT NULL)

### projects
- id (TEXT, PRIMARY KEY)
- name (TEXT, NOT NULL)

### tasks
- id (TEXT, PRIMARY KEY)
- subject (TEXT, NOT NULL)
- status (TEXT, CHECK: Technical | Physical | Undefined)
- priority (TEXT, CHECK: Low | Medium | High)
- message (TEXT)
- author (TEXT)
- userId (TEXT, FOREIGN KEY → users.id, ON DELETE SET NULL)
- projectId (TEXT, FOREIGN KEY → projects.id, ON DELETE CASCADE)

---

## Зв’язки між таблицями

- users → tasks (1:N)
- projects → tasks (1:N)

---

## Встановлення та запуск

### Встановлення залежностей
npm install

### Запуск у режимі розробки
npm run dev

Сервер запускається за адресою:
http://localhost:3000

---

## Ініціалізація бази даних

База даних створюється автоматично при старті застосунку.

- схема: src/infrastructure/schema.sql
- ініціалізація: initDb.ts
- наповнення тестовими даними: seed.ts

---

## API endpoints

### tasks
GET /api/v1/tasks
GET /api/v1/tasks/:id
POST /api/v1/tasks
PUT /api/v1/tasks/:id
DELETE /api/v1/tasks/:id

### додаткові endpoints
GET /api/v1/tasks/stats
GET /api/v1/tasks/with-users

---

## Приклад агрегації (COUNT)

GET /api/v1/tasks/stats

Відповідь:
[
  { "status": "Technical", "count": 3 },
  { "status": "Physical", "count": 2 }
]

---

## Приклад JOIN запиту

GET /api/v1/tasks/with-users

Відповідь містить задачі разом з ім’ям користувача.

---

## Демонстрація SQL injection (навчальна частина)

У проєкті присутній приклад небезпечного SQL формування через конкатенацію рядків:

db.all("SELECT * FROM tasks WHERE status='" + status + "'")

Це дозволяє SQL injection через параметри запиту.

Приклад шкідливого вводу:
status = 'Technical' OR 1=1

---

## Міграції

У проєкті використовується спрощена система міграцій.

- директорія: src/infrastructure/migrations
- таблиця контролю: schema_migrations
- при старті застосовуються тільки нові міграції

---

## Технології

- Node.js
- TypeScript
- Express
- SQLite3

---

## Особливості реалізації

- централізований доступ до бази даних
- DTO для вхідних даних
- validation layer
- middleware для помилок
- JOIN запити
- агрегаційні запити
- seed даних
- підтримка foreign keys