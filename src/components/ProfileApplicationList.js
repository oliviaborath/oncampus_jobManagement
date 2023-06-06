import { useEffect, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getApplicationsByJobEmail, getUserData } from '../firebase';
import { getDate } from '../functions';
import classes from './ProfileApplicationList.module.scss';

function ProfileApplicationList({ role, email }) {
  const [userData, setUserData] = useState({});
  const [allApplications, setAllApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [semesters, setSemesters] = useState(['All']);
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [jobsWorked, setJobsWorked] = useState(0);
  const [hoursRequired, setHoursRequired] = useState(0);
  const [hoursCompleted, setHoursCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        const userData = await getUserData(role, email);
        setUserData(userData);
        const allApplications = await getApplicationsByJobEmail(email);
        setAllApplications(allApplications);
        setApplications(allApplications);
        allApplications.forEach((application) => {
          if (!semesters.includes(application.job.semester)) {
            semesters.push(application.job.semester);
          }
        });
        setSemesters(semesters);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [role, email, semesters]);

  const filterChangeHandler = (event) => {
    const semester = event.target.value;
    setSelectedSemester(semester);
    if (semester !== 'All') {
      const filteredApplications = allApplications.filter(
        (application) => application.job.semester === semester
      );
      const approved = filteredApplications.filter(
        (application) => application.response === 'Approved'
      );
      let hoursWorked = 0;
      approved.forEach((application) => {
        hoursWorked += getHoursCompleted(application);
      });

      if (userData.semesters) {
        const hoursRequired = userData.semesters.find(
          (item) => item.semester === semester
        ).hoursRequired;
        setHoursRequired(hoursRequired);
      }

      setApplications(filteredApplications);
      setJobsWorked(approved.length);
      setHoursCompleted(hoursWorked);
    } else {
      setApplications(allApplications);
    }
  };

  const formatStatus = (application) => {
    if (application.response) {
      const response = application.response;
      const currentDate = new Date();
      let startDate, endDate, workDate;

      if (application.job.startDate && application.job.endDate) {
        startDate = new Date(application.job.startDate.seconds * 1000);
        endDate = new Date(application.job.endDate.seconds * 1000);
      } else if (application.job.workDate) {
        workDate = new Date(application.job.workDate.seconds * 1000);
      }

      if (
        (response === 'Approved' &&
          startDate?.getTime() < currentDate.getTime() &&
          currentDate.getTime() < endDate?.getTime()) ||
        currentDate.toDateString() === workDate?.toDateString()
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

  const getHoursCompleted = (application) => {
    let hoursCompleted = 0;
    if (application.workDays) {
      application?.workDays.forEach((day) => {
        hoursCompleted += Number(day.hoursWorked);
      });
    }

    return hoursCompleted;
  };

  return (
    <div className={classes.applications}>
      <div className={classes.header}>
        <h1>Applications ({applications.length})</h1>
        <Form.Select onChange={filterChangeHandler}>
          {semesters.map((semester, index) => (
            <option key={index}>{semester}</option>
          ))}
        </Form.Select>
      </div>
      {isLoading && <Spinner animation="border" variant="primary" />}
      {selectedSemester !== 'All' && (
        <div className={classes.application}>
          <div className={classes.details}>
            <div className={classes.item}>
              <p className={classes.type}>Jobs Worked</p>
              <p className={classes.content}>{jobsWorked || '-'}</p>
            </div>
            <div className={classes.item}>
              <p className={classes.type}>Hours Required</p>
              <p className={classes.content}>{hoursRequired || '-'}</p>
            </div>
            <div className={classes.item}>
              <p className={classes.type}>Hours Completed</p>
              <p className={classes.content}>{hoursCompleted || '-'}</p>
            </div>
          </div>
        </div>
      )}
      {applications.map((application, index) => (
        <Link
          to={`/application/${application.id}`}
          className={classes.application}
          key={index}
        >
          <p className={classes.title}>{application.job.position}</p>
          <p
            className={`${classes.status} ${
              classes[formatStatus(application).class]
            }`}
          >
            {formatStatus(application).status}
          </p>
          {application.job.startDate && application.job.endDate && (
            <>
              <p className={classes.period}>
                Start Date: <span>{getDate(application.job.startDate)}</span>
              </p>
              <p className={classes.period}>
                End Date: <span>{getDate(application.job.endDate)}</span>
              </p>
            </>
          )}
          {application.job.workDate && (
            <p className={classes.period}>
              Work Date: <span>{getDate(application.job.workDate)}</span>
            </p>
          )}
          <p className={classes.period}>
            Semester: <span>{application.job.semester}</span>
          </p>
          <div className={classes.details}>
            <div className={classes.item}>
              <p className={classes.type}>Venue</p>
              <p className={classes.content}>
                {application.job.venue ? application.job.venue : '-'}
              </p>
            </div>
            <div className={classes.item}>
              <p className={classes.type}>Hour Required</p>
              <p className={classes.content}>
                {application.job.hoursRequired
                  ? application.job.hoursRequired
                  : '-'}
              </p>
            </div>
            <div className={classes.item}>
              <p className={classes.type}>Hour Completed</p>
              <p className={classes.content}>
                {getHoursCompleted(application)
                  ? getHoursCompleted(application)
                  : '-'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProfileApplicationList;
