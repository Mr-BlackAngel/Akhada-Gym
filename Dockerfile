FROM python:3.11-slim

WORKDIR /app
COPY . /app

# Install system deps (if needed)
RUN apt-get update && apt-get install -y build-essential libpq-dev --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install python deps
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ENV PORT 8080
EXPOSE 8080

# Gunicorn start
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080", "--workers", "2"]
