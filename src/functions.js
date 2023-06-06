const formatZero = (number) => (number < 10 ? `0${number}` : number);

// timestamp = {seconds}
const getDate = (timestamp) => {
  if (timestamp) {
    if (timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return `${formatZero(date.getDate())}/${formatZero(
        date.getMonth() + 1
      )}/${formatZero(date.getFullYear())}`;
    } else {
      const date = new Date(timestamp);
      return `${formatZero(date.getDate())}/${formatZero(
        date.getMonth() + 1
      )}/${formatZero(date.getFullYear())}`;
    }
  } else {
    return `N/A`;
  }
};

const getTime = (timestamp) => {
  if (timestamp) {
    if (timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return `${formatZero(date.getHours())}:${formatZero(date.getMinutes())}`;
    } else {
      const date = new Date(timestamp);
      return `${formatZero(date.getHours())}:${formatZero(date.getMinutes())}`;
    }
  } else {
    return `N/A`;
  }
};

// 9:00 -> 9
// 9:30 -> 9.5
function formatTime(time) {
  if (time) {
    return Number(time.split(':')[0]) + Number(time.split(':')[1] / 60);
  } else {
    return null;
  }
}

// schedule = {
//   mon: {
//     from: '13:00',
//     to: '16:00'
//   },
//   tue: {
//     from: '13:00',
//     to: '16:00'
//   },
// }
const filterJobBySchedule = (courses, jobs) => {
  const courseSchedule = {};
  courses.forEach((course) => {
    course.days.forEach((day) => {
      if (courseSchedule[day]) {
        if (
          formatTime(course.time.from) < formatTime(courseSchedule[day].from)
        ) {
          courseSchedule[day].from = course.time.from;
        }
        if (formatTime(course.time.to) > formatTime(courseSchedule[day].to)) {
          courseSchedule[day].to = course.time.to;
        }
      } else {
        courseSchedule[day] = course.time;
      }
    });
  });

  jobs.forEach((job) => {
    const jobSchedule = {};
    job.workingDays.forEach((day) => {
      jobSchedule[day] = job.workingHours;
    });

    let fitSchedule = true;
    for (const [key, value] of Object.entries(courseSchedule)) {
      if (
        jobSchedule[key] &&
        courseSchedule[key] &&
        jobSchedule[key].from &&
        jobSchedule[key].to &&
        courseSchedule[key].from &&
        courseSchedule[key].to
      ) {
        // check if job start after class or finish before class start
        if (
          formatTime(jobSchedule[key].from) >
            formatTime(courseSchedule[key].to) ||
          formatTime(jobSchedule[key].to) < formatTime(courseSchedule[key].from)
        ) {
          continue;
        } else {
          fitSchedule = false;
        }
      }
    }
    job.fitSchedule = fitSchedule;
  });

  // return all job that fit schedule
  return jobs.filter((job) => job.fitSchedule);
};

export {
  getDate,
  getTime,
  filterJobBySchedule,
};
