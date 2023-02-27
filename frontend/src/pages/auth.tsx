import React from "react";
import CSRFToken from "../components/useCSRFToken";

function Auth() {
  return (
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
}

export default Auth