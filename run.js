const BLACK = 0, RED = 1, GREEN = 2, YELLOW = 3, BLUE = 4, MAGENTA = 5, CYAN = 6, WHITE = 7
const PRODUCTION = (process.argv[2] ?? process.env['ENV'] ?? '').startsWith('prod')

// Go into the dir of run.js
process.chdir(__dirname)

if (!PRODUCTION) {
    log('Running development server...')
    spawn(prefix('Django', RED), 'python -m poetry run python manage.py runserver', {callback: djangoLog, cwd: 'backend'})
    spawn(prefix('Vite', GREEN), 'npm start --silent', {cwd: 'frontend'})
    spawn(prefix('Caddy', YELLOW), 'caddy run', {callback: caddyLog})

} else {
    log('Running production test server...')
    spawn(prefix('Django', RED), 'python -m poetry run python manage.py runserver', {callback: djangoLog, cwd: 'backend'})
    spawn(prefix('Caddy', YELLOW), 'caddy run --config Caddyfile.prod', {callback: caddyLog})
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
        return (line + '\n'
            + `${pfx} | \n`
            + `${pfx} |   Running at ${color('http://localhost:80/', YELLOW)}\n`
            + `${pfx} | `)
        ready = true
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
    const subprocess = require('child_process')
    cmd = cmd.split(' ')
    const proc = subprocess.spawn(cmd[0], cmd.slice(1), { shell: true, stdio: 'pipe', ...options })
    let data = ''
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
