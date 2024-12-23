FROM node:16-alpine

# Установим рабочую директорию
WORKDIR /app

# Скопируем package.json и установим зависимости
COPY package.json .
RUN npm install

# Скопируем остальные файлы
COPY . .

# Даем права root (опционально, если требуется)
RUN chown -R root:root /app

# Устанавливаем пользователя и порт
USER root

EXPOSE 5173

# Указываем команду для запуска
CMD ["npm", "run", "dev"]
