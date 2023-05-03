# LikeHome Testing

## Running Tests

### Browser Automation

#### Prerequisites

```bash
npm install
npm install selenium-standalone install
poetry install
```

#### Running Tests

> Terminal 1

```bash
npm run selenium-standalone start
```

> Terminal 2

```bash
poetry shell
python -m pytest automation
```
