import React, { useEffect, useState } from 'react';
import { getJobs, getJobsByOwner, getStudentCourses } from '../firebase';
import { Link, useLocation } from 'react-router-dom';
import classes from './JobList.module.scss';
import { filterJobBySchedule, getDate } from '../functions';
import { Spinner } from 'react-bootstrap';

function JobList({ role, email }) {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [searchedJobs, setSearchedJobs] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (role === 'student') {
        const courses = await getStudentCourses(email);
        const jobs = await getJobs();
        const availableJobs = jobs.filter((job) => {
          const expiredDate = new Date(job.applicationPeriod.to.seconds * 1000);
          const currentDate = new Date();
          return (
            expiredDate.getTime() > currentDate.getTime() ||
            expiredDate.toDateString() === currentDate.toDateString()
          );
        });
        const data = filterJobBySchedule(courses, availableJobs);
        setData(data);
        setSearchedJobs(data);
        setPages(
          data.length % 10 === 0 ? data.length / 10 : data.length / 10 + 1
        );
      } else if (role === 'staff') {
        const data = await getJobsByOwner(email);
        setData(data);
        setSearchedJobs(data);
        setPages(
          data.length % 10 === 0 ? data.length / 10 : data.length / 10 + 1
        );
      } else if (role === 'admin') {
        const data = await getJobs(email);
        setData(data);
        setSearchedJobs(data);
        setPages(
          data.length % 10 === 0 ? data.length / 10 : data.length / 10 + 1
        );
      }
      setIsLoading(false);
    };
    fetchData();
  }, [role, email]);

  const searchJob = () => {
    const updatedSearchedJobs = data.filter((job) => {
      return (
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.position.toLowerCase().includes(query.toLowerCase()) ||
        job.type.toLowerCase().includes(query.toLowerCase()) ||
        job.semester.toLowerCase().includes(query.toLowerCase())
      );
    });
    setSearchedJobs(updatedSearchedJobs);
  };

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={classes.jobs}>
      {role === 'admin' && location.pathname === '/dashboard' && (
        <h2 className="mt-5">Jobs List ({data.length})</h2>
      )}
      {isLoading && <Spinner animation="border" variant="primary" />}
      {!isLoading && searchedJobs.length === 0 && (
        <h2 className="text-center">There's no job available</h2>
      )}
      {searchedJobs.length > 0 && (
        <div className={classes.search}>
          <input
            type="text"
            placeholder="Search jobs"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && searchJob()}
          />
          <button onClick={searchJob} className="btn btn-primary">
            Search
          </button>
        </div>
      )}
      {searchedJobs.length > 0 && (
        <div className={classes.title}>
          <p>Job</p>
          <p>Time</p>
          <p>Day/Date</p>
          <p>Type</p>
          <p>Venue</p>
        </div>
      )}
      {searchedJobs.length > 0 &&
        searchedJobs.map((job, index) => (
          <React.Fragment key={index}>
            {index >= (currentPage - 1) * 10 && index < currentPage * 10 && (
              <Link to={`/job/${job.id}`} className={classes.job} key={index}>
                <p>{job.position}</p>
                <p>
                  {job.workingHours.from} to {job.workingHours.to}
                </p>
                <p>
                  {!job.workDate &&
                    job.workingDays &&
                    job.workingDays.map((day, index) => (
                      <span key={index}>{day} </span>
                    ))}
                  {job.workDate && getDate(job.workDate)}
                </p>
                <p>{job.type}</p>
                <p>{job.venue}</p>
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

export default JobList;
