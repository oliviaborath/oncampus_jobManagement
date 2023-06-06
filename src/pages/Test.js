import classes from './Test.module.scss';
import { useDispatch } from 'react-redux';
import { setStudents } from '../store/studentSlice';
import { useState } from 'react';

function Test() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [id, setId] = useState('');

  function onGetStudents() {
    fetch(
      'https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app/students.json'
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(setStudents(data));
      });
  }
  function onAddStudent(data) {
    fetch(
      'https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app/students.json',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  function onDeleteStudent(id) {
    fetch(
      `https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app/students/${id}.json`,
      { method: 'DELETE' }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  function onAddStaff() {
    const data = {
      email,
      password,
      firstName,
      lastName,
      id,
    };
    fetch(
      'https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app/staffs.json',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  function onDeleteStaff(id) {
    fetch(
      `https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app/staffs/${id}.json`,
      { method: 'DELETE' }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  function onAddJob(data) {
    fetch(
      'https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app/jobs.json',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  function onDeleteJob(id) {
    fetch(
      `https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app/jobs/${id}.json`,
      { method: 'DELETE' }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  function onEditJob(id, data) {
    fetch(
      `https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app/available-jobs/${id}.json`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  return (
    <div className={classes.test}>
      <form action="" className={classes['test-form']}>
        <div className={classes['inputs-container']}>
          <div className={`${classes['form-control']}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={`${classes['form-control']} ${classes.password}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={`${classes['form-control']} ${classes.password}`}>
            <label htmlFor="password">First Name</label>
            <input
              type="firstName"
              name="firstName"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={`${classes['form-control']} ${classes.password}`}>
            <label htmlFor="password">Last Name</label>
            <input
              type="lastName"
              name="lastName"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className={`${classes['form-control']} ${classes.password}`}>
            <label htmlFor="password">ID</label>
            <input
              type="id"
              name="id"
              placeholder="Enter id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
        </div>
        <div className={`${classes['actions']}`}>
          <button type="button" onClick={onAddStudent}>
            Add Student
          </button>
          <button type="button" onClick={onAddStaff}>
            Add Staff
          </button>
          <button type="button" onClick={onAddJob}>
            Add Job
          </button>
          <button type="button" onClick={onDeleteStudent}>
            Delete Student
          </button>
          <button type="button" onClick={onDeleteStaff}>
            Delete Staff
          </button>
          <button type="button" onClick={onDeleteJob}>
            Delete Job
          </button>
          <button type="button" onClick={onEditJob}>
            Edit Job
          </button>
        </div>
      </form>
    </div>
  );
}

export default Test;
