import axios from "axios";
import { useState } from "react";

const AuthPage = (props) => {
  const [error, setError] = useState("");
  const onSubmit = (e) => {
    setError("");
    e.preventDefault();
    const username = e.target.elements.username.value;
    const secret = e.target.elements.secret.value;
    axios
      .post("http://localhost:3001/authenticate", { username, secret })
      .then((r) => props.onAuth({ ...r.data, secret }))
      .catch(() => setError("Sign-in failed. Check your username and password."));
  };

  return (
    <div className="background">
      <form onSubmit={onSubmit} className="form-card">
        <div className="form-title">Welcome 👋</div>

        <div className="form-subtitle">Sign in with your existing chat account</div>

        {error && <p role="alert">{error}</p>}
        <div className="auth">
          <div className="auth-label">Username</div>
          <input className="auth-input" name="username" autoComplete="username" required />
          <div className="auth-label">Password</div>
          <input className="auth-input" name="secret" type="password" autoComplete="current-password" required />
          <button className="auth-button" type="submit">
            Enter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;