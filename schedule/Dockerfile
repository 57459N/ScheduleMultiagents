FROM node:16-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json .
RUN npm install

# Копируем остальные файлы
COPY . .

# Устанавливаем права (если нужно)
RUN chown -R root:root /app

# Устанавливаем пользователя и порт
USER root
EXPOSE 5173

# Указываем команду для запуска
CMD ["npm", "run", "dev"]
    