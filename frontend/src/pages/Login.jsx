import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }

    // Temporary admin login for frontend testing
    if (
      email === 'admin@gmail.com' &&
      password === 'admin123'
    ) {
      sessionStorage.setItem('isLoggedIn', 'true');
      setError('');
      navigate('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          <Mail size={30} />
        </div>

        <h1>BulkMail Admin Login</h1>

        <p>Welcome to BulkMail.</p>

        {/* Demo Credentials */}
        <div className="login-credentials">
          <p>Demo Admin Credentials</p>
          <span>Email: admin@gmail.com</span>
          <span>Password: admin123</span>
        </div>

        <form onSubmit={handleLogin}>

          <div className="login-input">
            <Mail size={19} />

            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-input">
            <Lock size={19} />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button type="submit" className="login-button">
            <LogIn size={19} />
            Login
          </button>

        </form>

        <span className="login-footer">
          BulkMail · Email Management System
        </span>

      </div>

    </div>
  );
}

export default Login;
