import React, { useContext, useState } from 'react';
import '../Login.css';
import { AuthContext } from '../contexts/authentication.context.ts';

const LoginPage = () => {
  const { logIn } = useContext(AuthContext)!;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: { access_token: string } = await response.json();
    if (data.access_token) {
      logIn(data.access_token);
    }
    setPassword('');
    setEmail('');
  };

  const handleRegister = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Register button clicked. Email: ', email, ' Password: ', password);
  };

  return (
    <div className="container">
      <div className="left-side">
        <div id="description">GoGetter is your personal goal setter, designed to turn
          ambitions into achievements.
        </div>
      </div>
      <div className="form">
        <div className="control">
          <h2>Login</h2>
          <form>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Username"
            />
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <div>
              <button className="btn" onClick={handleLogin}>Login</button>
              <button className="btn" onClick={handleRegister}>Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;