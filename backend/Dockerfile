FROM python:3.11-slim

WORKDIR /app
RUN apt-get update && apt-get install -y \
	libxcb1 \
	libsm6 \
	libxext6 \
	libgl1 \
	libglib2.0-0 \
	&& rm -rf /var/lib/apt/lists/*


COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY ai_module ./ai_module

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
