# Отдельный сборочный образ, чтобы уменьшить финальный размер образа
FROM python:3.10-slim-bullseye as compile-image
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY req.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r req.txt

# Окончательный образ
FROM python:3.10-slim-bullseye
COPY --from=compile-image /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
WORKDIR /app
COPY backend /app/backend

EXPOSE 8000