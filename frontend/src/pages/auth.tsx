import CSRFToken from "../components/useCSRFToken";

export interface User {
  username: string;
  email: string;
}

type AuthProps = {
  user: User | null;
}

export function Auth({ user }: AuthProps) {
  return (
    user ? (
      <div className="card">
        <h2>Logged in as {user.email}</h2>
        <form action="/accounts/logout/" method='post'>
          <CSRFToken />
          <input type="submit" value="Logout" />
        </form>
      </div>
    ) : (
      <div className="card">
        <h2>Authentication Page</h2>
        <p>To make reservations or check on the status of existing reservations</p>
        <form action="/accounts/google/login/?process=login" method="post">
          <a href="/accounts/google/login"></a>
          <CSRFToken />
          <input type="submit" value="Login or Sign Up with Google" />
        </form>
      </div>
      )
  )
}

export default Auth