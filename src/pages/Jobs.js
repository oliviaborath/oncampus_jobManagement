import { useState } from 'react';
import JobFilter from '../components/JobFilter';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';
import classes from './Jobs.module.scss';

function Jobs({ role, email }) {
  const [openModal, setOpenModal] = useState(false);
  const [addJob, setAddJob] = useState(false);
  const [data, setData] = useState(null);

  function deleteJob(index) {
    // Delte function
  }

  return (
    <div className={classes['job-list']}>
      <h1 className={classes.title}>Jobs List</h1>
      {/* <JobFilter /> */}
      <JobList role={role} email={email} />
      {role === 'staff' && !addJob && (
        <button className={classes.add} onClick={() => setAddJob(true)}>
          Add One More Job
        </button>
      )}
      {addJob && <JobForm email={email} action='add' cancel={() => setAddJob(false)} />}
    </div>
  );
}

export default Jobs;
