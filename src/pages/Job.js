import DOMPurify from 'dompurify';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationList from '../components/ApplicationList';
import CourseList from '../components/CourseList';
import JobForm from '../components/JobForm';
import {
  addApplication,
  deleteJob,
  getApplicationsByJobId,
  getJob,
  getStudent,
} from '../firebase';
import { getDate } from '../functions';
import classes from './Job.module.scss';

function Job({ role, email }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({});
  const [application, setApplication] = useState(null);
  const [editJob, setEditJob] = useState(false);
  const [askConfirmation, setAskConfirmation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getJob(id);
      setJob(data);

      const applications = await getApplicationsByJobId(id);
      setApplication(
        applications.filter((application) => application.email === email)[0]
      );
    };
    fetchData();
  }, [id, email]);

  const apply = async () => {
    const data = await getStudent(email);
    data.job = job;
    addApplication(data);
    // temporary timestamp after applying
    data.timestamp = new Date();
    setApplication(data);
  };

  const confirmDelete = async () => {
    await deleteJob(id);
    navigate('/jobs');
  };

  return (
    <div className={`container ${classes.job}`}>
      <div className={classes.header}>
        <h1 className={classes.title}>{job.position}</h1>
        <p className={classes.date}>Date Posted : {getDate(job.timestamp)}</p>
      </div>
      {role === 'student' && !application && (
        <button className={`btn btn-primary ${classes.apply}`} onClick={apply}>
          Apply Now
        </button>
      )}
      {role === 'student' && application && (
        <p className={classes.applied}>
          Applied on {getDate(application.timestamp)}
        </p>
      )}
      <div className={classes.content}>
        <p>
          <span className={classes.title}>Application Period: </span>
          {getDate(job?.applicationPeriod?.from)} to{' '}
          {getDate(job?.applicationPeriod?.to)}
        </p>
        <p>
          <span className={classes.title}>Job Type:</span> {job.type}
        </p>
        <p>
          <span className={classes.title}>Hours Required: </span>
          {job.hoursRequired}
        </p>
        {job.startDate && job.endDate && (
          <p>
            <span className={classes.title}>Work Period: </span>
            {getDate(job.startDate)} to {getDate(job.endDate)}
          </p>
        )}
        {job.workDate && (
          <p>
            <span className={classes.title}>Work Period: </span>
            {getDate(job.workDate)}
          </p>
        )}
        <p>
          <span className={classes.title}>Work Venue: </span>{job.venue}
        </p>
        <p>
          <span className={classes.title}>Maximum Students Required: </span>
          {job.studentsRequired}
        </p>
        <p>
          <span className={classes.title}>Job Description:</span>
        </p>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(job.description),
          }}
        ></div>
        <p>
          <span className={classes.title}>Job Requirement:</span>
        </p>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(job.requirements),
          }}
        ></div>
      </div>

      {role === 'staff' && !editJob && !askConfirmation && (
        <div className={classes.actions}>
          <button className="btn btn-primary" onClick={() => setEditJob(true)}>
            Edit
          </button>
          <button
            className="btn btn-gray"
            onClick={() => setAskConfirmation(true)}
          >
            Delete
          </button>
        </div>
      )}
      {role === 'staff' && askConfirmation && (
        <div className={classes.confirmation}>
          <h2 className="text-center my-4">
            Are you sure you want to delete this job?
          </h2>
          <div className={classes.actions}>
            <button className="btn btn-primary" onClick={confirmDelete}>
              Yes
            </button>
            <button
              className="btn btn-gray"
              onClick={() => setAskConfirmation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {role === 'staff' && editJob && (
        <JobForm
          id={id}
          email={email}
          action="edit"
          cancel={() => setEditJob(false)}
        />
      )}
      {role === 'student' && <CourseList email={email} />}
      {role === 'staff' && <ApplicationList jobId={id} />}
    </div>
  );
}

export default Job;
