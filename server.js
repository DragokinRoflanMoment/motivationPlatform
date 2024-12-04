const express = require("express"); // Подключаем Express
const sqlite3 = require("sqlite3").verbose(); // Подключаем SQLite
const bodyParser = require("body-parser"); // Подключаем Body-parser

const app = express(); // Создаем сервер
const PORT = 3000; // Указываем порт для работы

// Подключение к базе данных
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных", err.message);
  } else {
    console.log("База данных подключена.");
  }
});

// Создание таблиц, если их еще нет
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);
});

// Настройка middleware
app.use(bodyParser.urlencoded({ extended: true })); // Для обработки данных из форм
app.use(express.static("public")); // Для раздачи статических файлов (HTML, CSS, JS)

// Главная страница
app.get("/", (req, res) => {
  res.send("<h1>Добро пожаловать на платформу!</h1>");
});

// Страница с заданиями
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).send("Ошибка базы данных");
    } else {
      res.json(rows); // Отправляем список заданий в формате JSON
    }
  });
});

// Добавление нового задания
app.post("/tasks", (req, res) => {
  const { title, description } = req.body; // Получаем данные из формы
  db.run("INSERT INTO tasks (title, description) VALUES (?, ?)", [title, description], (err) => {
    if (err) {
      res.status(500).send("Ошибка базы данных");
    } else {
      res.redirect("/tasks"); // Перенаправляем на страницу заданий
    }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
