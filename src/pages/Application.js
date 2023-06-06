import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getApplication,
  getStudent,
  updateApplication,
  updateStudent,
} from '../firebase';
import { getDate } from '../functions';
import classes from './Application.module.scss';

// React Bootstrap
import Dropdown from 'react-bootstrap/Dropdown';
import CourseList from '../components/CourseList';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form } from 'react-bootstrap';
import DOMPurify from 'dompurify';

function Application({ role }) {
  const { id } = useParams();
  const [application, setApplication] = useState({});
  const [response, setResponse] = useState('Rejected');
  const [date, setDate] = useState(new Date());
  const [studentStatus, setStudentStatus] = useState('Present');
  const [hoursWorked, setHoursWorked] = useState(0);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getApplication(id);
      if (data.response) {
        setResponse(data.response);
      }
      if (data.workDays) {
        data.workDays.sort(
          (a, b) =>
            new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000)
        );
      }
      setApplication(data);
    };
    fetchData();
  }, [id]);

  const save = () => {
    const data = {
      response,
    };
    updateApplication(id, data);
    setEdit(false);
    fetchData();
  };

  const fetchData = async () => {
    const data = await getApplication(id);
    if (data.workDays) {
      data.workDays.sort(
        (a, b) =>
          new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000)
      );
    }
    setApplication(data);
  };

  const saveWorkDay = async () => {
    const workDay = {
      date,
      studentStatus,
      hoursWorked,
    };

    let workDays = application.workDays;
    if (!workDays) {
      workDays = [];
    }
    workDays.push(workDay);

    const updateApplicationData = {
      workDays,
    };

    const student = await getStudent(application.email);
    const currentHours = student.hoursWorked ? student.hoursWorked : 0;
    const updateStudentData = {
      hoursWorked: Number(currentHours) + Number(hoursWorked),
    };
    await updateStudent('student-1@mail.com', updateStudentData);
    await updateApplication(id, updateApplicationData);
    fetchData();
  };

  const removeWorkDay = async (index) => {
    const workDays = application.workDays;
    const hoursToRemove = workDays[index].hoursWorked;
    workDays.splice(index, 1);

    const updateApplicationData = {
      workDays,
    };

    const student = await getStudent(application.email);
    const currentHours = student.hoursWorked ? student.hoursWorked : 0;
    const updateStudentData = {
      hoursWorked: Number(currentHours) - Number(hoursToRemove),
    };
    await updateStudent('student-1@mail.com', updateStudentData);
    await updateApplication(id, updateApplicationData);
    fetchData();
  };

  return (
    <div className={`container ${classes.application}`}>
      <div className={classes.header}>
        <h1 className={classes.title}>
          {application.firstName} {application.lastName}
        </h1>
        <p className={classes.date}>
          Date Applied : {getDate(application.timestamp)}
        </p>
      </div>
      <div className={classes.content}>
        <p>Student ID: {application.studentId}</p>
        <p>Faculty: {application.faculty}</p>
        <p>Email: {application.email}</p>
      </div>

      {application.job && (
        <div className={classes.content}>
          <h2 className="mb-2">{application.job.position}</h2>
          {application.job.startDate && application.job.endDate && (
            <p>
              From {getDate(application.job.startDate)} to{' '}
              {getDate(application.job.endDate)}
            </p>
          )}
          {application.job.workDate && (
            <p>On {getDate(application.job.workDate)}</p>
          )}
          <p>{application.job.location}</p>
          <p>Maximum Student Required: {application.job.studentsRequired}</p>
          <p>Job Description</p>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(application.job.description),
            }}
          ></div>
          <p>Job Requirement</p>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(application.job.requirements),
            }}
          ></div>
        </div>
      )}

      {role === 'staff' && <CourseList email={application.email} />}
      <div className={classes.actions}>
        {application.response && !edit && (
          <>
            <p className={classes.response}>{application.response}</p>
            {role === 'staff' && (
              <button
                className="btn btn-primary d-block mx-auto"
                onClick={() => setEdit(true)}
              >
                Edit Response
              </button>
            )}
          </>
        )}
        {((role === 'staff' && !application.response) || edit) && (
          <>
            <Dropdown className={classes['dropdown']}>
              <Dropdown.Toggle variant="primary" id="dropdown-response">
                {response === 'Approved' ? 'Approve' : 'Reject'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setResponse('Approved')}>
                  Approve
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setResponse('Rejected')}>
                  Reject
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <div className="form-group">
              <label htmlFor="recommendation">Recommendation</label>
              <textarea
                name="recommendation"
                id="recommendation"
                rows="5"
              ></textarea>
            </div> */}
            <div className={classes.buttons}>
              <button
                type="button"
                className={`btn btn-primary ${classes.submit}`}
                onClick={save}
              >
                Submit
              </button>
              {edit && (
                <button
                  type="button"
                  onClick={() => setEdit(false)}
                  className={`btn ${classes.cancel}`}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
        {role === 'staff' && application.response === 'Approved' && (
          <form className="default-form three-cols">
            <div className="form-group">
              <label htmlFor="working-hours">Date</label>
              <DatePicker selected={date} onChange={(date) => setDate(date)} />
            </div>
            <div className="form-group">
              <label htmlFor="working-hours">Status</label>
              <div className={classes['hours-container']}>
                <Form.Select onChange={(e) => setStudentStatus(e.target.value)}>
                  <option>Present</option>
                  <option>Absent</option>
                </Form.Select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="hours-worked">Hours Worked</label>
              <input
                name="hours-worked"
                id="hours-worked"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
              />
            </div>
            <div className="form-group span">
              <button
                type="button"
                className="btn btn-primary d-block mx-auto"
                onClick={saveWorkDay}
              >
                Save
              </button>
            </div>
          </form>
        )}
        {application.workDays?.length > 0 && (
          <div className={classes['work-days']}>
            <div className={classes.title}>
              <p>Date</p>
              <p>Status</p>
              <p>Hours Worked</p>
              {role === 'staff' && <p></p>}
            </div>
            {application.workDays.map((day, index) => (
              <div className={classes.day} key={index}>
                <p>{getDate(day.date)}</p>
                <p>{day.studentStatus}</p>
                <p>{day.hoursWorked}</p>
                {role === 'staff' && (
                  <button
                    className="btn btn-gray"
                    onClick={() => removeWorkDay(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Application;
