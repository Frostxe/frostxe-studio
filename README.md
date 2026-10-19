# FROSTXE INTERACTIVE — Game Development Studio Portfolio

Официальный сайт игровой студии **Frostxe Interactive**, основанной Омурбеком Четымбаевым (студент 4 курса Международного Университета «Ала-Тоо», Foundation Creative Industry).

Official website & portfolio for **Frostxe Interactive** game development studio, founded by Omurbek Chetymbaev (4th-year student at Ala-Too International University, Foundation Creative Industry).

---

🔗 **Live Demo (GitHub Pages):** [https://frostxe.github.io/frostxe-studio/](https://frostxe.github.io/frostxe-studio/)  
📦 **GitHub Repository:** [https://github.com/Frostxe/frostxe-studio](https://github.com/Frostxe/frostxe-studio)  
💬 **Telegram Bot:** [@Frostxeintr_bot](https://t.me/Frostxeintr_bot)

---

## ⚡ Новые возможности / Key Features

- **🌐 Двуязычный интерфейс (RU / EN)**:
  - Мгновенное переключение языка в шапке сайта `[ RU | EN ]` и в мобильном меню
  - Полная локализация всех разделов: навигация, HUD терминал, манифест студии, карточки игр, технические спецификации, форма заявки и модальные окна
  - Сохранение выбранного языка в `localStorage`
  - Dynamic bilingual support with seamless UI toggling and state persistence

- **🤖 Прямая интеграция Telegram Bot API (@Frostxeintr_bot)**:
  - Подключен официальный Telegram-бот: `8613108837:AAFclHQVxsJ4WXMs2hd6EBb2t0e-B27fyC4`
  - Ссылка на бота: [@Frostxeintr_bot](https://t.me/Frostxeintr_bot)
  - Функция **Авто-определения Chat ID** (через Telegram `getUpdates`) в 1 клик
  - Мгновенная отправка заявок с формы консультации прямо в Telegram с оформлением Markdown
  - Тестовый пинг и возможность подключения собственного бота
  - Быстрый доступ к боту прямо из навигации и карточек сайта

- **🎮 Интерактивный Game-Dev & Cyberpunk интерфейс**:
  - Процедурная симуляция тактической карты **Territory Wars** (HTML5 Canvas 2D) с динамической перегенерацией
  - Визуальный шоукейс **Meme Generator** с живым превью слоев
  - Интерактивная галерея студии и исследовательских прототипов (WebGL, шейдеры GLSL)
  - Синтезатор звуковых эффектов на чистом Web Audio API (с кнопкой включения/выключения звука SFX)
  - Интерактивный звездный кибер-фон с физикой отталкивания частиц курсором

---

## 🚀 Запуск / Local Setup

Проект не требует тяжелых сторонних сборщиков и готов к запуску в любом статическом веб-сервере:

```bash
# Запуск через npx serve или http-server:
npx serve -l 3456
```

Сайт доступен по адресу: `http://localhost:3456`
