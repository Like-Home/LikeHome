import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'

import { Auth as AuthPage, User } from './pages/auth'


// ensures a CSRF token is set in the cookies
fetch('/api/csrf')

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // TODO: move this to state management
    fetch('/api/user/me')
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          return null
        }
      })
      .then(setUser)
  }, [])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <AuthPage user={user} />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
