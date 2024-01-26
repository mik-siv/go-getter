import React, { useContext, useState } from 'react';
import '../Login.css';
import { AuthContext } from '../contexts/authentication.context.ts';

const LoginPage = () => {
  const { logIn } = useContext(AuthContext)!;
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfrimPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: { access_token: string, message?: string } = await response.json();
    if (!response.ok && data.message) return setError(data.message ?? 'Server error, try again later');
    if (data.access_token) {
      logIn(data.access_token);
    }

    setPassword('');
    setEmail('');
  };

  const handleRegister = async () => {
    if (!password || !email || !confirmPassword || !username) return setError('Please fill in all the fields');
    if (password.length < 6 || password.length > 50) return setError('Password must be between 6 and 32 characters');
    if (password !== confirmPassword) return setError('Passwords don\'t match');
    if (username.length > 3 || username.length > 50) return setError('Name must be between 3 and 32 characters');
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) return setError('Invalid email format');
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });


    const data = await response.json();
    if (!response.ok) return setError(data.message);
    if (response.ok) {
      setIsLoginMode(true);
    }

    setPassword('');
    setUsername('');
    setConfrimPassword('');
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');

    if (isLoginMode && e.currentTarget.name === 'login') {
      handleLogin();
    } else if (!isLoginMode && e.currentTarget.name === 'register') {
      handleRegister();
    } else {
      setIsLoginMode(!isLoginMode);
    }
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
          <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
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
            {!isLoginMode && (
              <>
                <input
                  className="input-field"
                  type="password"
                  value={confirmPassword}
                  maxLength={32}
                  onChange={(e) => setConfrimPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                />
                <input
                  className="input-field"
                  type="text"
                  value={username}
                  maxLength={32}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Your Name"
                />
              </>
            )}
            {error && <div className="error">{error}</div>}
            <div>
              <button
                className="btn"
                name="login"
                onClick={handleButtonClick}
              >
                Login
              </button>
              <button
                className="btn"
                name="register"
                onClick={handleButtonClick}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;