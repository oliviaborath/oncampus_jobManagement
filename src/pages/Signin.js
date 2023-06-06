import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  auth,
  logInWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import classes from './Signin.module.scss';
import abac from '../assets/images/abac.png';
import students from '../assets/images/students.png';
import google from '../assets/images/google.png';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate('/');
  }, [user, loading]);

  return (
    <div className={classes.signin}>
      <div className={classes.images}>
        <img src={students} alt="" />
      </div>
      <form action="" className={classes['signin-form']}>
        <h2>Sign in</h2>
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
        <button
          type="button"
          className={classes.login}
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Signin;
