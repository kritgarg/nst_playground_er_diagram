FROM python:3.12-slim

# Install system dependencies required for CMake and Bliss compilation
RUN apt-get update && \
    apt-get install -y --no-install-recommends git build-essential cmake && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first for optimal Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt uvicorn

# Build Bliss graph-isomorphism binary
COPY setup.sh .
RUN bash setup.sh

# Copy application source code and migration scripts
COPY app/ app/
COPY alembic/ alembic/
COPY alembic.ini .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
