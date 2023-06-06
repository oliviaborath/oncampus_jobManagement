import { useEffect, useState } from 'react';
import classes from './Profile.module.scss';
import banner from '../assets/images/banner.png';
import { getApplicationsByJobEmail, getUserData } from '../firebase';
import CourseList from '../components/CourseList';
import ProfileApplicationList from '../components/ProfileApplicationList';

function Profile({ role, email }) {
  const [data, setData] = useState({});
  const [view, setView] = useState('profile');
  const [hoursCompleted, setHoursCompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (role && email) {
        const data = await getUserData(role, email);
        setData(data);

        const allApplications = await getApplicationsByJobEmail(email);
        const semester = data.semester;
        const approved = allApplications.filter(
          (application) =>
            application.job.semester === semester &&
            application.response === 'Approved'
        );
        let hoursWorked = 0;
        approved.forEach((application) => {
          hoursWorked += getHoursCompleted(application);
        });
        setHoursCompleted(hoursWorked);
      }
    };

    fetchData();
  }, [role, email]);

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
    <div className={classes.profile}>
      <div className={classes.hero}>
        <img src={banner} alt="" />
        <h1>Welcome {data.firstName}</h1>
      </div>

      {role === 'student' && (
        <div className={classes['types']}>
          <div
            className={`${classes['slider']} ${
              view === 'applications' ? classes['right'] : ''
            }`}
          />
          <button
            onClick={() => setView('profile')}
            className={`${view === 'profile' ? classes['active'] : ''}`}
          >
            Profile
          </button>
          <button
            onClick={() => setView('applications')}
            className={`${view === 'applications' ? classes['active'] : ''}`}
          >
            Applications
          </button>
        </div>
      )}

      {role === 'student' && view === 'profile' && (
        <h1 className={classes.header}>Profile</h1>
      )}
      {view === 'profile' && (
        <div className={classes.content}>
          <div className={classes.row}>
            <p className={classes.title}>Account Type</p>
            <p className={classes.info}>{role.toUpperCase()}</p>
          </div>
          <div className={classes.row}>
            <p className={classes.title}>ID</p>
            <p className={classes.info}>{data.id}</p>
          </div>
          <div className={classes.row}>
            <p className={classes.title}>First Name</p>
            <p className={classes.info}>{data.firstName}</p>
          </div>
          <div className={classes.row}>
            <p className={classes.title}>Last Name</p>
            <p className={classes.info}>{data.lastName}</p>
          </div>
          <div className={classes.row}>
            <p className={classes.title}>Email</p>
            <p className={classes.info}>{data.email}</p>
          </div>
          {role === 'student' && (
            <>
            <div className={classes.row}>
                <p className={classes.title}>Semester</p>
                <p className={classes.info}>
                  {data.semester}
                </p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>Hours Required</p>
                <p className={classes.info}>
                  {data.hoursRequired}
                </p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>Hours Completed</p>
                <p className={classes.info}>
                  {hoursCompleted}
                </p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>Hours Remaining</p>
                <p className={classes.info}>
                  {data.hoursRequired - hoursCompleted}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {role === 'student' && view === 'profile' && <CourseList email={email} />}
      {role === 'student' && view === 'applications' && (
        <ProfileApplicationList role={role} email={email} />
      )}
    </div>
  );
}

export default Profile;
