FROM python:3.11-slim

# Setup env
ENV LANG C.UTF-8 \
    LC_ALL C.UTF-8 \
    PYTHONDONTWRITEBYTECODE 1 \
    PYTHONFAULTHANDLER 1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.0.0


# Install pipenv and compilation dependencies
RUN pip install poetry
RUN apt-get update && apt-get install -y --no-install-recommends gcc

WORKDIR /app
COPY poetry.lock pyproject.toml .
RUN poetry config virtualenvs.create false \ 
 && poetry install --no-dev --no-interaction --no-ansi

COPY . .