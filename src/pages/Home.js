import classes from './Home.module.scss';
import banner from '../assets/images/banner.png';
import homeImage1 from '../assets/images/home-image-1.png';
import JobList from '../components/JobList';
import { useEffect, useState } from 'react';

// React Bootstrap
import Dropdown from 'react-bootstrap/Dropdown';
import { getApplicationsByJobEmail } from '../firebase';
import { getDate } from '../functions';

function Home({ role, email }) {
  const [venue, setVenue] = useState('Venue');
  const [upcomingJob, setUpcomingJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        const data = await getApplicationsByJobEmail(email);
        const upcomingJob = data.find((app) => {
          let startDate;
          const currentDate = new Date().getTime();
          if (app.job.startDate) {
            startDate = new Date(app.job.startDate.seconds * 1000).getTime();
          } else if (app.job.workDate) {
            startDate = new Date(app.job.workDate.seconds * 1000).getTime();
          }
          return app.response === 'Approved' && currentDate < startDate;
        });
        setUpcomingJob(upcomingJob);
      }
    };

    fetchData();
  }, [email]);

  return (
    <div className={classes.home}>
      <div className={classes.hero}>
        <img src={banner} alt="" />
        <h1>Scholarship Student Job Portal</h1>
      </div>

      {/* <form action="">
        <div
          className={`${classes['form-control']} ${classes['search-title']}`}
        >
          <input type="text" placeholder="Search Title or Keyword" />
        </div>
        <div className={classes.line}></div>
        <Dropdown className={classes['dropdown']}>
          <Dropdown.Toggle variant="primary" id="dropdown-venue">
            {venue}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setVenue('Venue 1')}>
              Venue 1
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setVenue('Venue 2')}>
              Venue 2
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setVenue('Venue 3')}>
              Venue 3
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <button className={classes.search}>Search</button>
      </form> */}

      <div className={classes.container}>
        {upcomingJob && (
          <div className={classes.upcoming}>
            <p className={classes.title}>Upcoming Job:</p>
            <div className={classes.details}>
              <div className={classes.item}>
                <p className={classes.type}>Job</p>
                <p className={classes.content}>
                  {upcomingJob.job.position || '-'}
                </p>
              </div>
              <div className={classes.item}>
                <p className={classes.type}>Date</p>
                <p className={classes.content}>
                  {upcomingJob.job.startDate
                    ? getDate(upcomingJob.job.startDate)
                    : getDate(upcomingJob.job.workDate)}
                </p>
              </div>
              <div className={classes.item}>
                <p className={classes.type}>Venue</p>
                <p className={classes.content}>
                  {upcomingJob.job.venue ? upcomingJob.job.venue : '-'}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className={classes['join-social']}>
          <div className={classes.heading}>
            <h2>
              Join <span>Social Work</span> for a better <span>Community</span>
            </h2>
          </div>
          <div className={classes.content}>
            <img src={homeImage1} alt="" />
            <div>
              <p>
                This platform allow Assumption University scholarship student to
                search for job in order to fulfill their hour given by the
                university. Student can apply for job in this platform and
                please note that working during class time is not allowed.
                However, this platform is for scholarship students only.
              </p>
              <p>
                PS. The volunteer work that student participate must be done
                without getting paid.
              </p>
            </div>
          </div>
        </div>

        <div className={classes.heading}>
          <h2>
            <span>Hiring!!!</span>
          </h2>
          <button className="btn btn-primary">View All</button>
        </div>
        <div className={classes.hiring}>
          <JobList role={role} email={email} />
        </div>
      </div>
    </div>
  );
}

export default Home;
