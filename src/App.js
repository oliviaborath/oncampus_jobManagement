import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import Header from './components/Header';
import { auth, getUserRole } from './firebase';
import Dashboard from './pages/admin/Dashboard';
import Application from './pages/Application';
import Applications from './pages/Applications';
import Home from './pages/Home';
import Job from './pages/Job';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import RequestStatus from './pages/RequestStatus';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Test from './pages/Test';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [role, setRole] = useState('');

  useEffect(() => {
    const getRole = async () => {
      if (user?.email === 'admin@student-scholar.com') {
        setRole('admin');
      } else if (user) {
        const role = await getUserRole(user?.email);
        setRole(role);
      }
    };

    getRole();
  }, [user]);

  return (
    <div className="app">
      <Header role={role} />
      <Routes>
        <Route path="/" element={<Home role={role} email={user?.email} />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
        <Route path="request-status" element={<RequestStatus />} />
        <Route path="jobs" element={<Jobs role={role} email={user?.email} />} />
        <Route path="job" element={<Job role={role} email={user?.email} />} />
        <Route path="job/:id" element={<Job role={role} email={user?.email} />} />
        {/* <Route path="applications" element={<Applications role={role} email={user?.email} />} /> */}
        <Route path="application/:id" element={<Application role={role} />} />
        <Route path="test-api" element={<Test />} />
        <Route path="dashboard" element={<Dashboard role={role} />} />
        <Route path="profile" element={<Profile role={role} email={user?.email} />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
