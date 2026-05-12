# Инструкция по запуску AutoShow

## Требования (Prerequisites)

- Python 3.8+
- Node.js 16+

## Установка и запуск (Setup & Run)

### 1. Backend (Django)

Откройте терминал в корневой директории проекта (`AutoShow`) и выполните следующие команды:

```bash
# Создание виртуального окружения (если еще не создано)
python3 -m venv venv

# Активация виртуального окружения
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Применение миграций базы данных
python manage.py migrate

# Создание суперпользователя (для доступа к панели администратора)
python manage.py createsuperuser

# Запуск локального сервера
python manage.py runserver
```

API бекенда будет доступно по адресу `http://localhost:8000`.
Панель администратора: `http://localhost:8000/admin`.

*Тестовые данные для входа в админ-панель:*
Логин: `Bogdan`
Пароль: `12345`

### 2. Frontend (React)

Откройте **новый** терминал, перейдите в папку frontend и выполните команды:

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск сервера разработки
npm run dev
```

Фронтенд часть будет доступна по адресу `http://localhost:5173`.
