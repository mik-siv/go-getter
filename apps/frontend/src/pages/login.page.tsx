import React, { useContext, useState } from 'react';
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
  };

  const handleRegister = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Implement your register functionality here
    console.log('Register button clicked. Email: ', email, ' Password: ', password);
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;