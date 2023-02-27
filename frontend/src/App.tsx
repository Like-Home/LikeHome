import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'

import AuthPage from './pages/auth'
import CSRFToken from "./components/useCSRFToken";

fetch('http://localhost/api/csrf/')

interface User {
  username: string;
  email: string;
}

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch('http://localhost/api/user/me')
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          return null
        }
      })
      .then(setUser)
  }, [])
  console.log(user, !!user)
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
      {
        user ? (
          <div className="card">
            <h2>Logged in as {user.email}</h2>
            <form action="/accounts/logout/" method='post'>
              <CSRFToken />
              <input type="submit" value="Logout" />
            </form>
          </div>
        ) : <AuthPage />
      }
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
