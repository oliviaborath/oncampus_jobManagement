import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationsByJobOwner } from '../firebase';
import { getDate } from '../functions';
import classes from './Applications.module.scss';

function Applications({ email }) {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        const data = await getApplicationsByJobOwner(email);
        setData(data);
        setPages(
          data.length % 10 === 0 ? data.length / 10 : data.length / 10 + 1
        );
      }
    };
    fetchData();
  }, [email]);

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
          <p className={classes.no}>No.</p>
          <p>Date</p>
          <p>Position</p>
          <p>Name</p>
          <p>Faculty</p>
          <p>Status</p>
        </div>
      )}
      {data.length > 0 &&
        data.map((application, index) => (
          <React.Fragment key={index}>
            {index >= (currentPage - 1) * 10 && index < currentPage * 10 && (
              <Link
                to={`/application/${application.id}`}
                className={classes.application}
              >
                <p className={classes.no}>{index + 1}</p>
                <p>{getDate(application.timestamp)}</p>
                <p>{application.job.position}</p>
                <p>
                  {application.firstName} {application.lastName}
                </p>
                <p>{application.faculty}</p>
                <p className={classes[formatStatus(application).class]}>
                  {formatStatus(application).status}
                </p>
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

export default Applications;
