# Запуск проекта

Установите postgres, node.js и poetry. Создайте базу данных в postgres. В файле .env укажите параметры подключения к
базе данных.

1. **Установка зависимостей**:
   Для установки зависимостей backend и frontend выполните команду:
   ```bash
   poetry install // в папке backend
   npm install // в папке frontend
   ```
2. **Запуск backend**:

   Сгенерируйте таблицы в базе данных:
    ```bash
    poetry run python setup_db.py
    ```
   Для запуска выполните команду:
    ```bash
    poetry run python run_app.py
    ```
3. **Запуск frontend**:
   Для запуска frontend выполните команду:
   ```bash
   npm run dev
   ```

1. **Создание пользователя системы**:
    - В проекте реализована регистрация и аутентификация пользователей. В auth_router.py определены маршруты `/register`
      и `/login`, которые обрабатывают POST-запросы для регистрации и входа пользователей
      соответственно. Модель пользователя описана в auth_models.py как класс User.

2. **Функция записи путешествия**:
    - Пользователи могут создавать записи о своих путешествиях. В travel_posts_router.py определен маршрут POST
      `/travel_posts/`, который обрабатывает создание новых записей о путешествиях. Модель записи о путешествии описана
      в travel_posts_models.py как класс TravelPost.

3. **Функция просмотра путешествий других пользователей**:
    - Пользователи могут просматривать записи о путешествиях других пользователей. В travel_posts_router.py определен
      маршрут GET `/travel_posts/`, который возвращает список всех записей о путешествиях, кроме записей текущего
      пользователя.

4. **Стоимость путешествия**:
    - В модели TravelPost в travel_posts_models.py есть поле cost, которое хранит стоимость путешествия. Это поле
      валидируется методом assert_valid, чтобы убедиться, что стоимость не является отрицательной.

5. **Места культурного наследия**:
    - В модели TravelPost есть поле cultural_heritage_sites, которое хранит список мест культурного наследия в виде
      массива строк.

6. **Оценка удобства передвижения, безопасности, населенности и растительности**:
    - В модели TravelPost есть поля transportation_rating, safety_rating, overcrowding_rating и nature_rating, которые
      хранят оценки удобства передвижения, безопасности, населенности и растительности соответственно. Эти поля
      валидируются методом assert_valid, чтобы убедиться, что оценки находятся в допустимых пределах (от 0 до 5).

7. **Клиентская часть**:
    - В screens реализованы экраны для регистрации, входа, создания, и редактирования записей о путешествиях, а также для
      просмотра ленты путешествий и профиля пользователя. Например, экран регистрации реализован в RegisterScreen.tsx, а
      экран создания записи о путешествии в CreatePostScreen+UpdatePostScreen.tsx.

8. **Генерация OpenAPI спецификации**:
    - В app.py создается файл openapi.json, который содержит спецификацию API в формате OpenAPI. Этот файл используется
      в клиентской части для генерации типов TypeScript на основе схемы API.
