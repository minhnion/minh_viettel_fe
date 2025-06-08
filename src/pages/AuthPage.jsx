import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi, registerApi } from '../api/index';

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsTransitionActive(!isTransitionActive);
    setConfirmPasswordError('');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'registerPassword') {
      setShowRegisterPassword(!showRegisterPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    } else if (field === 'loginPassword') {
      setShowLoginPassword(!showLoginPassword);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setConfirmPasswordError('');

    if (registerPassword !== registerConfirmPassword) {
      setConfirmPasswordError("Password and confirmation password don't match");
      return;
    }

    setIsRegisterLoading(true);
    console.log('Đang thực hiện đăng ký...');

    try {
      const userData = {
        fullName: registerUsername,
        email: registerEmail,
        password: registerPassword,
        confirmPassword: registerConfirmPassword,
      };
      const data = await registerApi(userData);

      toast.success('Registration successful! Please check your email to verify your account.');
      console.log('Đăng ký thành công:', data);
      navigate('/auth/check-email', { state: { email: registerEmail } });
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const credentials = { email: loginEmail, password: loginPassword };
      const data = await loginApi(credentials);

      console.log('Đăng nhập thành công:', data);
      navigate('/');
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="auth-layout-container">
      <div className={`auth-container ${isTransitionActive ? 'right-panel-active' : ''}`}>
        <div className="tab-container">
          <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => toggleForm(true)}>
            Sign In
          </button>
          <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => toggleForm(false)}>
            Sign Up
          </button>
        </div>

        <div className="form-wrapper">
          <div className={`form-container sign-in-container ${!isLogin ? 'hide' : ''}`}>
            <form onSubmit={handleLogin}>
              <h1>Sign In</h1>
              <div className="social-container">
                <a href="#" className="social">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="social">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="social">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <span>or use your email password</span>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <div className="password-container">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <span className="toggle-password" onClick={() => togglePasswordVisibility('loginPassword')}>
                  {showLoginPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                </span>
              </div>
              <button type="submit" disabled={isLoginLoading}>
                {isLoginLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className={`form-container sign-up-container ${isLogin ? 'hide' : ''}`}>
            <form onSubmit={handleRegister}>
              <h1>Create Account</h1>
              <input
                type="text"
                placeholder="Name"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <div className="password-container">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <span className="toggle-password" onClick={() => togglePasswordVisibility('registerPassword')}>
                  {showRegisterPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                </span>
              </div>
              <div className="password-container">
                <div className="password-input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className={confirmPasswordError ? 'error-input' : ''}
                    required
                  />
                  <span className="toggle-password" onClick={() => togglePasswordVisibility('confirmPassword')}>
                    {showConfirmPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                  </span>
                </div>
              </div>
              <div>
                {confirmPasswordError && <p className="input-error">{confirmPasswordError}</p>}
              </div>
              <button type="submit" disabled={isRegisterLoading}>
                {isRegisterLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className={`overlay-panel overlay-left ${!isLogin ? 'hide' : ''}`}>
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button type="button" className="ghost" onClick={() => toggleForm(true)}>
                Sign In
              </button>
            </div>
            <div className={`overlay-panel overlay-right ${isLogin ? 'hide' : ''}`}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button type="button" className="ghost" onClick={() => toggleForm(false)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;