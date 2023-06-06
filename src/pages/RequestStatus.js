import classes from './RequestStatus.module.scss';

const DUMMY_DATA = [
  {
    company: 'Microsoft',
    type: 'freelance',
    deadline: '07/07/2022',
    title: 'Senior UI Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat nunc ac a magna at elementum. Cras arcu varius in aliquam habitant fermentum. Mi sit lorem mollis vitae quis curabitur vestibulum.',
    status: 'Pending',
  },
  {
    company: 'Microsoft',
    type: 'freelance',
    deadline: '07/07/2022',
    title: 'Senior UI Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat nunc ac a magna at elementum. Cras arcu varius in aliquam habitant fermentum. Mi sit lorem mollis vitae quis curabitur vestibulum.',
    status: 'Accepted',
  },
  {
    company: 'Microsoft',
    type: 'freelance',
    deadline: '07/07/2022',
    title: 'Senior UI Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat nunc ac a magna at elementum. Cras arcu varius in aliquam habitant fermentum. Mi sit lorem mollis vitae quis curabitur vestibulum.',
    status: 'Pending',
  },
  {
    company: 'Microsoft',
    type: 'freelance',
    deadline: '07/07/2022',
    title: 'Senior UI Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat nunc ac a magna at elementum. Cras arcu varius in aliquam habitant fermentum. Mi sit lorem mollis vitae quis curabitur vestibulum.',
    status: 'Pending',
  },
  {
    company: 'Microsoft',
    type: 'freelance',
    deadline: '07/07/2022',
    title: 'Senior UI Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat nunc ac a magna at elementum. Cras arcu varius in aliquam habitant fermentum. Mi sit lorem mollis vitae quis curabitur vestibulum.',
    status: 'Pending',
  },
  {
    company: 'Microsoft',
    type: 'freelance',
    deadline: '07/07/2022',
    title: 'Senior UI Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat nunc ac a magna at elementum. Cras arcu varius in aliquam habitant fermentum. Mi sit lorem mollis vitae quis curabitur vestibulum.',
    status: 'Pending',
  },
  {
    company: 'Microsoft',
    type: 'freelance',
    deadline: '07/07/2022',
    title: 'Senior UI Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat nunc ac a magna at elementum. Cras arcu varius in aliquam habitant fermentum. Mi sit lorem mollis vitae quis curabitur vestibulum.',
    status: 'Pending',
  },
];

function RequestStatus() {
  return (
    <div className={classes['request-status']}>
      <h1 className={classes.title}>Requests Status</h1>
      <div className={classes.jobs}>
        {DUMMY_DATA.map((job) => (
          <div className={classes.card}>
            <p className={classes.status}>{job.status}</p>
            <div className={classes.header}>
              <img
                src="https://cdn.arstechnica.net/wp-content/uploads/2021/03/microsoft-800x534.jpg"
                alt=""
                className={classes['header-image']}
              />
              <div className={classes['header-text']}>
                <h3>{job.company}</h3>
                <p>{job.type}</p>
              </div>
            </div>
            <div className={classes.body}>
              <h3 className={classes['job-title']}>{job.title}</h3>
              <p className={classes.deadline}>{job.deadline}</p>
              <p className={classes.description}>{job.description}</p>
            </div>
            {job.status === 'Pending' ? (
              <div className={classes.actions}>
                <button className={classes.cancel}>Cancel</button>
              </div>
            ) : (
              <div className={classes.actions}>
                <button className={classes.accept}>Accept</button>
                <button className={classes.reject}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RequestStatus;
