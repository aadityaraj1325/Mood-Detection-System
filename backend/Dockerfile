FROM python:3.11-slim

WORKDIR /app
# No system GUI libraries needed for headless opencv


COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY ai_module ./ai_module

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
