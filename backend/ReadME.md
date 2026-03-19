Backend

Цей проект реалізує REST API для наскрізного проекту на TypeScript без використання бази даних. Дані зберігаються в пам’яті, а сервер обробляє HTTP-запити, повертаючи JSON.

Можливості

CRUD-операції для сутностей проекту
GET /api/tasks – отримати всі завдання
GET /api/tasks/:id – отримати завдання за ID
POST /api/tasks – створити нове завдання
PUT /api/tasks/:id – оновити завдання
DELETE /api/tasks/:id – видалити завдання
Контроль статус-кодів HTTP (200, 201, 204, 400, 404, 500)
Використання DTO для запитів і відповідей
Базова валідація даних
Централізована обробка помилок
Мінімальне логування HTTP-запитів

Технології

Node.js
TypeScript
Express
npm (залежності та скрипти)

Структура проекту

backend/
├── node_modules/
├── src/
│   ├── controllers/
│   │   ├── health.controller.ts
│   │   ├── projects.controller.ts
│   │   └── tasks.controller.ts
│   ├── domain/
│   │   └── task.dto.ts
│   ├── infrastructure/
│   │   ├── apiError.ts
│   │   ├── errorMiddleware.ts
│   │   ├── validation.ts
│   │   └── wrap.ts
│   ├── routes/
│   │   ├── health.routes.ts
│   │   ├── projects.routes.ts
│   │   └── tasks.routes.ts
│   ├── services/
│   │   ├── health.service.ts
│   │   └── tasks.service.ts
│   ├── store/
│   │   └── tasks.store.ts
│   ├── app.ts
│   └── server.ts
├── package-lock.json
├── package.json
└── tsconfig.json

Встановлення та запуск

Встановіть залежності:

npm install

Запуск у режимі розробки:

npm run dev

Запуск зібраного проекту:

npm run build
npm start

Сервер запускається на http://localhost:3000.