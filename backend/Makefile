.DEFAULT_GOAL := all
sources = app api # tests

.PHONY: install
install:
	poetry install

.PHONY: format
format:
	poetry run isort $(sources)
	poetry run autopep8 --in-place --recursive $(sources)

.PHONY: mypy
typecheck:
	poetry run mypy $(sources)

# TODO: implement after adding tests
# .PHONY: test
# test:
# 	pipenv run coverage run -m pytest --durations=10

.PHONY: all
all: lint mypy testcov
