import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationsByJobEmail, getApplicationsByJobId } from '../firebase';
import { getDate, getTime } from '../functions';
import classes from './ApplicationList.module.scss';

function ApplicationList({ jobId, email }) {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetching');
      if (jobId) {
        // const data = await getApplicationsByJobId(jobId);
        const data = await getApplicationsByJobId(jobId);
        setData(data);
        setPages(
          data.length % 10 === 0 ? data.length / 10 : data.length / 10 + 1
        );

        const pending = data.filter(
          (application) => !application.response
        ).length;
        const approved = data.filter(
          (application) => application.response === 'Approved'
        ).length;
        const rejected = data.filter(
          (application) => application.response === 'Rejected'
        ).length;
        setPendingCount(pending);
        setApprovedCount(approved);
        setRejectedCount(rejected);
      } else if (email) {
        // const data = await getApplicationsByJobEmail(email);
        const data = await getApplicationsByJobEmail(email);
        setData(data);
        setPages(
          data.length % 10 === 0 ? data.length / 10 : data.length / 10 + 1
        );
      }
    };
    fetchData();
  }, [jobId, email]);

  const formatStatus = (application) => {
    if (application.response) {
      const response = application.response;
      const startDate = new Date(application.startDate).getTime();
      const endDate = new Date(application.endDate).getTime();
      const currentDate = new Date().getTime();
      if (
        response === 'Approved' &&
        startDate < currentDate &&
        currentDate < endDate
      ) {
        return {
          class: 'ongoing',
          status: 'Ongoing',
        };
      } else {
        return {
          class: response.toLowerCase(),
          status: response,
        };
      }
    } else {
      return {
        class: 'pending',
        status: 'Pending',
      };
    }
  };

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={classes.applications}>
      {data.length > 0 && (
        <div className={classes.title}>
          <p>Total Applications: {data.length}</p>
          <p>
            Total Pending: <span className={classes.pending}>{pendingCount}</span>
          </p>
          <p>
            Total Approved: <span className={classes.approved}>{approvedCount}</span>
          </p>
          <p>
            Total Rejected: <span className={classes.rejected}>{rejectedCount}</span>
          </p>
        </div>
      )}
      {data.length > 0 && (
        <div className={classes.title}>
          <p className={classes.no}>No.</p>
          {jobId && <p>Name</p>}
          <p>Date</p>
          <p>Time</p>
          {jobId && <p>Faculty</p>}
          {jobId && <p>Status</p>}
        </div>
      )}
      {data.length > 0 &&
        data.map((applicant, index) => (
          <React.Fragment key={index}>
            {index >= (currentPage - 1) * 10 && index < currentPage * 10 && (
              <Link
                to={`/application/${applicant.id}`}
                className={classes.application}
              >
                <p className={classes.no}>{index + 1}</p>
                {jobId && (
                  <p>
                    {applicant.firstName} {applicant.lastName}
                  </p>
                )}
                {email && <p>{applicant.position}</p>}
                <p>{getDate(applicant.timestamp)}</p>
                <p>{getTime(applicant.timestamp)}</p>
                {jobId && <p>{applicant.faculty}</p>}
                {jobId && (
                  <p className={classes[formatStatus(applicant).class]}>
                    {formatStatus(applicant).status}
                  </p>
                )}
              </Link>
            )}
          </React.Fragment>
        ))}
      {data.length > 0 && (
        <div className="pagination">
          {Array.from({ length: pages }).map((_, index) => (
            <p
              className={`page ${index + 1 === currentPage ? 'active' : ''}`}
              key={index}
              onClick={() => changePageHandler(index + 1)}
            >
              {index + 1}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicationList;
