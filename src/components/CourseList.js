import { useEffect, useState } from 'react';
import { getStudentCourses } from '../firebase';
import { getDate, getTime } from '../functions';
import classes from './CourseList.module.scss';

function CourseList({ email }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        const data = await getStudentCourses(email);
        setData(data);
      }
    };

    fetchData();
  }, [email]);

  return (
    <div className={classes['course-list']}>
      {data.length > 0 && (
        <div className={classes.title}>
          <p>Course ID</p>
          <p>Course Name</p>
          <p>Days</p>
          <p>Time</p>
        </div>
      )}
      {data.length > 0 &&
        data.map((course, index) => (
          <div className={classes.course} key={index}>
            <p>{course.id}</p>
            <p>{course.name}</p>
            <p>
              {course.days.map((day, index) => (
                <span key={index}>{day} </span>
              ))}
            </p>
            <p>
              {course.time.from} to {course.time.to}
            </p>
          </div>
        ))}
    </div>
  );
}

export default CourseList;
