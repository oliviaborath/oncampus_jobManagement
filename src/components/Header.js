import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '../firebase';
import abac from '../assets/images/abac.png';
import classes from './Header.module.scss';

function Header({ role }) {
  let activeStyle = {
    color: '#f20404',
  };
  const [user] = useAuthState(auth);
  const location = useLocation();

  return (
    <header className={classes.header}>
      <img src={abac} alt="" className={classes.logo} />
      <div className={classes['nav-links']}>
        <NavLink
          to="/"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          Home
        </NavLink>
        <NavLink
          to="jobs"
          style={({ isActive }) =>
            isActive || location.pathname.split('/').includes('job')
              ? activeStyle
              : undefined
          }
        >
          Jobs
        </NavLink>
        {role === 'admin' && (
          <NavLink
            to="dashboard"
            style={({ isActive }) =>
              isActive || location.pathname.split('/').includes('job')
                ? activeStyle
                : undefined
            }
          >
            Dashboard
          </NavLink>
        )}
        {/* {role === 'staff' && (
          <NavLink
            to="applications"
            style={({ isActive }) =>
              isActive || location.pathname.split('/').includes('application')
                ? activeStyle
                : undefined
            }
          >
            Applications
          </NavLink>
        )} */}
      </div>
      {!user && (
        <div className={classes['auth-links']}>
          <Link to="signin" className={classes.login}>
            Login
          </Link>
        </div>
      )}
      {user && (
        <div className={classes['auth-links']}>
          <Link to="/profile" className={classes.profile}>
            Profile
          </Link>
          <Link to="/" className={classes.logout} onClick={logout}>
            Logout
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
