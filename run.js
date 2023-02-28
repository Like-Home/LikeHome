const fs = require('fs')
const subprocess = require('child_process')
const path = require('path')
    
const BLACK = 0, RED = 1, GREEN = 2, YELLOW = 3, BLUE = 4, MAGENTA = 5, CYAN = 6, WHITE = 7
const PRODUCTION = (process.argv[2] ?? process.env['ENV'] ?? '').startsWith('prod')

// Go into the dir of run.js
process.chdir(__dirname)

// Detect if already in Poetry virtual environment
// TODO: some windows users might need a py -3.11 prefix
const PYTHON_PATH = process.env.PYTHON || process.env.POETRY_ACTIVE === '1' ? 'python' : 'python -m poetry run python'
const CADDY_PATH = process.env.CADDY || 'caddy'

const createSubLogger = log => (level, msg) => log(prefix(level, {
        error: RED,
        warn: YELLOW,
        info: MAGENTA,
        debug: CYAN,
    }[level], 5), '| ', msg)

/**
 * Load environment variables from .env files
 */
function loadDotEnv(postfix = '') {
    const logger = createSubLogger((...args) => {
        console.log(`${prefix('Environ', GREEN)} |`, ...args)
    })
    
    const filename = `.env${postfix}`

    const locations = [
        path.join(__dirname, 'backend', filename),
        path.join(__dirname, 'frontend', filename),
        path.join(__dirname, filename),
    ]

    const existingLocations = locations.filter(fs.existsSync)

    if (existingLocations.length === 0) {
        logger('warn', 'No .env file found.')
    } else {
        existingLocations.forEach(location => {
            logger('info', `| Loading environment variables from ${location}`)
            fs.readFileSync(location, 'utf8').split('\n').forEach(line => {
                if (line.startsWith('#') || line.trim() === '') return
                const [key, ...value] = line.split('=')
                process.env[key] = value.join('=')
            })
        })
    }
}

function checkVersion(cmd, version, options = {}) {
    cmd = cmd.split(' ')
    const child = subprocess.spawnSync(cmd[0], cmd.slice(1), { encoding: 'utf8', ...options });
    if (child.status !== 0) {
        console.log(`Error: The program "${path}" failed with status code "${child.status}"`)
        process.exit(1)
    }

    return child.stdout.includes(version)
}

if (!process.version.startsWith('v18.')) { 
    console.log("Error: Incorrect version of NodeJS. Please use NodeJS v16")
    process.exit(1)
}

if (!checkVersion(`${PYTHON_PATH} -V`, '3.11.', { cwd: 'backend' })) {
    console.log("Error: Incorrect version of Python. Please use Python 3.11")
    process.exit(1)
}

if (!PRODUCTION) {
    loadDotEnv()
    log('Running development server...')
    spawn(prefix('Django', RED), `${PYTHON_PATH} manage.py runserver`, {
        callback: djangoLog,
        cwd: 'backend',
    })
    spawn(prefix('Vite', GREEN), 'npm start --silent', {
        cwd: 'frontend',
    })
    spawn(prefix('Caddy', YELLOW), `${CADDY_PATH} run`, {callback: caddyLog})

} else {
    loadDotEnv('.prod')
    log('Running production test server...')
    spawn(prefix('Django', RED), `${PYTHON_PATH} manage.py runserver`, {
        callback: djangoLog,
        cwd: 'backend',
    })
    spawn(prefix('Caddy', YELLOW), `${CADDY_PATH} run --config Caddyfile.prod`, {
        callback: caddyLog,
    })
}

// Special logger for Caddy
function caddyLog(line) {
    try {
        const data = JSON.parse(line)
        let {level, ts, logger, msg, ...rest} = data

        if (Object.keys(rest).length > 0)
            rest = color(JSON.stringify(rest), BLACK) //util.inspect(rest, {colors: true, depth: 10, breakLength: Infinity})
        else
            rest = ''

        const colors = {error: RED, warn: YELLOW, info: MAGENTA}
        level = prefix(level, colors[level] ?? WHITE, 5)
        logger = logger ? color(logger, CYAN) + ' ' : ''

        return `${level} | ${logger}${msg} ${rest}`
    } catch (err) {
        if (err instanceof SyntaxError)
            return line
        else
            throw err
    }
}

// Indicate the server is ready after Django starts
let ready = false
function djangoLog(line) {
    if (!ready) {
        let pfx = prefix('General', BLUE)
        ready = true // TODO: maybe check vite too, larger projects might take longer to build
        return (line + '\n'
            + `${pfx} | \n`
            + `${pfx} | Running at ${color('http://localhost:80/', YELLOW)}\n`
            + `${pfx} | `)
    }
}

function prefix(str, col, len=7) {
    return color(str.padEnd(len), col)
}

function color(str, color) {
    return `\x1b[${30 + color}m${str}\x1b[0m`
}

function log(...args) {
    console.log(`${prefix('General', BLUE)} |`, ...args)
}

function spawn(name, cmd, options={}) {
    cmd = cmd.split(' ')
    const proc = subprocess.spawn(cmd[0], cmd.slice(1), { shell: true, stdio: 'pipe', ...options })
    let data = '';
    for (let stream of [proc.stdout, proc.stderr]) {
        stream.on('data', chunk => {
            data += chunk
            const lines = data.split('\n')
            data = lines.pop()
            for (let line of lines) {
                if (options.callback)
                    line = options.callback(line) ?? line
                console.log(`${name} | ${line}`)
            }
        })
    }
}
