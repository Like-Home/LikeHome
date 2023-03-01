.DEFAULT_GOAL := all
sources = app api # tests

.PHONY: run
run:
	poetry run python manage.py runserver

.PHONY: format
format:
	poetry run isort $(sources)
	poetry run autopep8 --in-place --recursive $(sources)

.PHONY: setup
setup:
	poetry install
	poetry run python manage.py makemigrations
	poetry run python manage.py migrate --run-syncdb
	poetry run python manage.py createsuperuser

.PHONY: mypy
typecheck:
	poetry run mypy $(sources)

# TODO: implement after adding tests
# .PHONY: test
# test:
# 	pipenv run coverage run -m pytest --durations=10

.PHONY: all
all: lint mypy testcov
