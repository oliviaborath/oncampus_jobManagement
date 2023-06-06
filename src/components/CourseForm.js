import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import classes from './CourseForm.module.scss';

function CourseForm({
  index,
  numberOfCourses,
  setNumberOfCourse,
  setCourseContent,
  removeCourse,
  data,
}) {
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [course, setCourse] = useState({
    time: {
      from: '9:00',
      to: '12:00',
    },
  });
  const [hourFrom, setHourFrom] = useState('9:00');
  const [hourTo, setHourTo] = useState('12:00');
  const [courseDays, setCourseDays] = useState([]);
  const [isMonCheck, setIsMonCheck] = useState(false);
  const [isTueCheck, setIsTueCheck] = useState(false);
  const [isWedCheck, setIsWedCheck] = useState(false);
  const [isThuCheck, setIsThuCheck] = useState(false);
  const [isFriCheck, setIsFriCheck] = useState(false);
  const [isSatCheck, setIsSatCheck] = useState(false);
  const [isSunCheck, setIsSunCheck] = useState(false);

  useEffect(() => {
    if (data) {
      if (!data.time) {
        data.time = {
          from: '9:00',
          to: '12:00',
        };
      }
      setCourse(data);
      setCourseId(data.id);
      setCourseName(data.name);
      setHourFrom(data.time?.from);
      setHourTo(data.time?.to);
      setCourseDays(data.days || []);

      setIsMonCheck(data.days?.includes('Mon'));
      setIsTueCheck(data.days?.includes('Tue'));
      setIsWedCheck(data.days?.includes('Wed'));
      setIsThuCheck(data.days?.includes('Thu'));
      setIsFriCheck(data.days?.includes('Fri'));
      setIsSatCheck(data.days?.includes('Sat'));
      setIsSunCheck(data.days?.includes('Sun'));
    }
  }, [data]);

  const courseIdChangeHandler = (event) => {
    setCourseId(event.target.value);
    course.id = event.target.value;
    setCourse(course);
    setCourseContent(index, course);
  };

  const courseNameChangeHandler = (event) => {
    setCourseName(event.target.value);
    course.name = event.target.value;
    setCourse(course);
    setCourseContent(index, course);
  };

  const onDaySelectHandler = (day) => {
    if (courseDays.includes(day)) {
      const updatedSelectedDays = courseDays.filter(
        (selectedDay) => selectedDay !== day
      );
      course.days = updatedSelectedDays;
      setCourseDays(updatedSelectedDays);
      setCourse(course);
      setCourseContent(index, course);
    } else {
      courseDays.push(day);
      course.days = courseDays;
      setCourseDays(courseDays);
      setCourse(course);
      setCourseContent(index, course);
    }
  };

  const onHourFromChangedHandler = (event) => {
    setHourFrom(event.target.value);
    if (course.time) {
      course.time.from = event.target.value;
    } else {
      course.time = {
        from: event.target.value,
      };
    }
    setCourse(course);
    setCourseContent(index, course);
  };

  const onHourToChangedHandler = (event) => {
    setHourTo(event.target.value);
    if (course.time) {
      course.time.to = event.target.value;
    } else {
      course.time = {
        to: event.target.value,
      };
    }
    setCourse(course);
    setCourseContent(index, course);
  };

  const monCheckHandler = (event) => {
    setIsMonCheck(event.target.checked);
    onDaySelectHandler('Mon');
  };

  const tueCheckHandler = (event) => {
    setIsTueCheck(event.target.checked);
    onDaySelectHandler('Tue');
  };

  const wedCheckHandler = (event) => {
    setIsWedCheck(event.target.checked);
    onDaySelectHandler('Wed');
  };

  const thuCheckHandler = (event) => {
    setIsThuCheck(event.target.checked);
    onDaySelectHandler('Thu');
  };

  const friCheckHandler = (event) => {
    setIsFriCheck(event.target.checked);
    onDaySelectHandler('Fri');
  };

  const satCheckHandler = (event) => {
    setIsSatCheck(event.target.checked);
    onDaySelectHandler('Sat');
  };

  const sunCheckHandler = (event) => {
    setIsSunCheck(event.target.checked);
    onDaySelectHandler('Sun');
  };

  return (
    <div className={classes['course-form']}>
      <div className="form-group">
        <label htmlFor="course-id">Course ID</label>
        <input
          type="text"
          id={`course-id-${index}`}
          name="course-id"
          placeholder="Enter course id"
          onChange={courseIdChangeHandler}
          value={courseId}
        />
      </div>
      <div className="form-group">
        <label htmlFor="course-name">Course Name</label>
        <input
          type="text"
          id={`course-name-${index}`}
          name="course-name"
          placeholder="Enter course name"
          onChange={courseNameChangeHandler}
          value={courseName}
        />
      </div>
      <div className="form-group">
        <label htmlFor="study-days">Study Days</label>
        <div className="days-container">
          <Form.Check
            label="Mon"
            name="day"
            type="checkbox"
            checked={isMonCheck}
            onChange={monCheckHandler}
          />
          <Form.Check
            label="Tue"
            name="day"
            type="checkbox"
            checked={isTueCheck}
            onChange={tueCheckHandler}
          />
          <Form.Check
            label="Wed"
            name="day"
            type="checkbox"
            checked={isWedCheck}
            onChange={wedCheckHandler}
          />
          <Form.Check
            label="Thu"
            name="day"
            type="checkbox"
            checked={isThuCheck}
            onChange={thuCheckHandler}
          />
          <Form.Check
            label="Fri"
            name="day"
            type="checkbox"
            checked={isFriCheck}
            onChange={friCheckHandler}
          />
          <Form.Check
            label="Sat"
            name="day"
            type="checkbox"
            checked={isSatCheck}
            onChange={satCheckHandler}
          />
          <Form.Check
            label="Sun"
            name="day"
            type="checkbox"
            checked={isSunCheck}
            onChange={sunCheckHandler}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="study-hours">Study Hours</label>
        <div className="hours-container">
          <Form.Select onChange={onHourFromChangedHandler} value={hourFrom}>
            <option>9:00</option>
            <option>9:30</option>
            <option>10:00</option>
            <option>10:30</option>
            <option>11:00</option>
            <option>11:30</option>
            <option>12:00</option>
            <option>12:30</option>
            <option>13:00</option>
            <option>13:30</option>
            <option>14:00</option>
            <option>14:30</option>
            <option>15:00</option>
            <option>15:30</option>
            <option>16:00</option>
            <option>16:30</option>
            <option>17:00</option>
            <option>17:30</option>
            <option>18:00</option>
            <option>18:30</option>
            <option>19:00</option>
            <option>19:30</option>
            <option>20:00</option>
            <option>20:30</option>
            <option>21:00</option>
            <option>21:30</option>
            <option>22:00</option>
          </Form.Select>
          <p>to</p>
          <Form.Select onChange={onHourToChangedHandler} value={hourTo}>
            <option>9:00</option>
            <option>9:30</option>
            <option>10:00</option>
            <option>10:30</option>
            <option>11:00</option>
            <option>11:30</option>
            <option>12:00</option>
            <option>12:30</option>
            <option>13:00</option>
            <option>13:30</option>
            <option>14:00</option>
            <option>14:30</option>
            <option>15:00</option>
            <option>15:30</option>
            <option>16:00</option>
            <option>16:30</option>
            <option>17:00</option>
            <option>17:30</option>
            <option>18:00</option>
            <option>18:30</option>
            <option>19:00</option>
            <option>19:30</option>
            <option>20:00</option>
            <option>20:30</option>
            <option>21:00</option>
            <option>21:30</option>
            <option>22:00</option>
          </Form.Select>
        </div>
      </div>
      <div className="form-group">
        <button
          type="button"
          className="btn btn-gray"
          onClick={() => removeCourse(index)}
        >
          Remove Course
        </button>
      </div>
    </div>
  );
}

export default CourseForm;
