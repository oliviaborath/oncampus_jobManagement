import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from '../firebase';
import classes from './Signup.module.scss';
import abac from '../assets/images/abac.png';
import students from '../assets/images/students.png';
import google from '../assets/images/google.png';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const register = () => {
    if (!username) alert('Please enter username');
    registerWithEmailAndPassword(username, email, password);
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate('/');
  }, [user, loading]);

  return (
    <div className={classes.signup}>
      <div className={classes.images}>
        <img src={abac} alt="" />
        <img src={students} alt="" />
      </div>
      <form action="" className={classes['signup-form']}>
        <h2>Sign up</h2>
        <p>If you already have an account registered</p>
        <p>
          You can{' '}
          <a href="http://google.com/" className={classes['login-link']}>
            Login here!
          </a>
        </p>
        <div className={`${classes['form-control']} ${classes.email}`}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={`${classes['form-control']} ${classes.username}`}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={`${classes['form-control']} ${classes.password}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={`${classes['form-control']} ${classes.password}`}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="button" className={classes.register} onClick={register}>
          Register
        </button>
        <p className={classes.continue}>or continue with</p>
        <button
          type="button"
          className={classes.google}
          onClick={signInWithGoogle}
        >
          <img src={google} alt="" />
        </button>
      </form>
    </div>
  );
}

export default Signup;
