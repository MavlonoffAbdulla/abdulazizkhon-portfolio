# Инструкция по развертыванию (Deployment Guide)

Данное руководство содержит пошаговые инструкции по деплою вашего портфолио на удаленный сервер (VPS/VDS под управлением Ubuntu).

---

## Шаг 1. Подготовка сервера

Рекомендуется использовать чистую операционную систему **Ubuntu 20.04 LTS** или **Ubuntu 22.04 LTS**.

### 1. Установите Docker и Docker Compose:
Подключитесь к вашему серверу через SSH и выполните команды:

```bash
# Обновите пакеты
sudo apt update && sudo apt upgrade -y

# Установите Docker
sudo apt install docker.io -y

# Запустите и добавьте Docker в автозапуск
sudo systemctl enable --now docker

# Установите Docker Compose v2 (плагин)
sudo apt install docker-compose-plugin -y
```

---

## Шаг 2. Загрузка проекта на сервер

Вы можете склонировать репозиторий через Git или перенести файлы архивом на сервер (например, с помощью SFTP/FileZilla).

Поместите проект в папку `/var/www/portfolio`:

```bash
mkdir -p /var/www/portfolio
cd /var/www/portfolio
# (Скопируйте сюда все файлы проекта)
```

---

## Шаг 3. Настройка переменных окружения

Создайте рабочий файл конфига `.env` из шаблона:

```bash
cp .env.example .env
nano .env
```

Заполните ваши боевые настройки:
* `TELEGRAM_BOT_TOKEN`: Токен вашего боевого Telegram-бота от @BotFather.
* `TELEGRAM_CHAT_ID`: Ваш личный Telegram ID (или ID группы), куда бот будет слать заявки с контактной формы.
* `PUBLIC_URL`: Боевой домен вашего сайта (например, `https://abdulazizkhon.uz`). Необходим для авто-регистрации вебхука бота.
* `ADMIN_PASSWORD`: Придумайте сложный пароль для доступа к админ-панели управления проектами (`/admin`).

---

## Шаг 4. Подготовка директорий и прав доступа

Для сохранения ваших проектов и скриншотов настроено монтирование томов Docker (Volumes). Подготовим необходимые директории на сервере:

```bash
# Создайте папки для хранения базы данных и скриншотов
mkdir -p data
mkdir -p public/img/screenshots

# Дайте права на чтение/запись для Docker
chmod -R 777 data
chmod -R 777 public/img/screenshots
```

---

## Шаг 5. Запуск контейнера

Запустите сборку и старт Docker-контейнера в фоновом режиме:

```bash
sudo docker compose up -d --build
```

Проверить статус работы и логи контейнера можно с помощью:

```bash
sudo docker compose ps
sudo docker compose logs -f portfolio
```

На данном этапе сайт запустится локально на порту **`8099`**.

---

## Шаг 6. Настройка Nginx и SSL (HTTPS)

Для того чтобы сайт открывался по красивому домену с защищенным HTTPS-соединением (обязательно для работы Telegram WebApp), настроим Nginx и бесплатный сертификат Let's Encrypt.

### 1. Установите Nginx и Certbot:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### 2. Создайте файл конфигурации сайта в Nginx:
```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Вставьте следующий блок конфигурации (замените `abdulazizkhon.uz` на ваш реальный домен):

```nginx
server {
    listen 80;
    server_name abdulazizkhon.uz www.abdulazizkhon.uz;

    # Перенаправление всех запросов в Docker на порт 8099
    location / {
        proxy_pass http://127.0.0.1:8099;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M; # Для загрузки скриншотов проектов в админке
    }
}
```

### 3. Активируйте конфиг и перезапустите Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Получите бесплатный SSL-сертификат Let's Encrypt:
```bash
sudo certbot --nginx -d abdulazizkhon.uz -d www.abdulazizkhon.uz
```
Certbot автоматически получит сертификаты, перенастроит Nginx на работу по HTTPS (порт 443) и настроит автоматический редирект с HTTP на HTTPS.

---

## Готово! 🚀
* Твой сайт будет доступен по адресу: `https://abdulazizkhon.uz`
* Панель администратора для создания, редактирования и удаления проектов находится по адресу: `https://abdulazizkhon.uz/admin`
* Бот авто-зарегистрирует вебхук и сразу начнет принимать заявки и пересылать их тебе в Telegram.
