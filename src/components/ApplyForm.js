import { useState } from 'react';
import { addApplication } from '../firebase';
import { applyToJob } from '../functions';
import classes from './ApplyForm.module.scss';
import CourseForm from './CourseForm';

function ApplyForm({ jobId }) {
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [faculty, setFaculty] = useState('');
  const [numberOfCourses, setNumberOfCourse] = useState(1);
  const [courses, setCourses] = useState([]);

  const increaseCourses = () => {
    let n = numberOfCourses;
    n++;
    setNumberOfCourse(n);
    courses.push({});
    setCourses(courses);
  };

  const setCourseContent = (index, content) => {
    courses[index] = content;
    setCourses(courses);
  }

  const apply = () => {
    const data = {
      jobId,
      studentId,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      faculty,
      courses
    };

    console.log(data);
    addApplication(data);
  };

  return (
    <div className={classes['apply-form']} id="apply-form">
      <h3>Apply for this job</h3>

      <form className="default-form">
        <div className="form-group">
          <label htmlFor="student-id">Student ID</label>
          <input
            type="text"
            id="student-id"
            name="student-id"
            placeholder="Enter id"
            onChange={(event) => setStudentId(event.target.value)}
            value={studentId}
          />
        </div>
        <div className="form-group" />
        <div className="form-group">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            placeholder="Enter first name"
            onChange={(event) => setFirstName(event.target.value)}
            value={firstName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            placeholder="Enter last name"
            onChange={(event) => setLastName(event.target.value)}
            value={lastName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Phone Number</label>
          <input
            type="text"
            id="phone-number"
            name="phone-number"
            placeholder="Enter phone number"
            onChange={(event) => setPhoneNumber(event.target.value)}
            value={phoneNumber}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <input
            type="text"
            id="gender"
            name="gender"
            placeholder="Enter gender"
            onChange={(event) => setGender(event.target.value)}
            value={gender}
          />
        </div>
        <div className="form-group">
          <label htmlFor="faculty">Faculty</label>
          <input
            type="text"
            id="faculty"
            name="faculty"
            placeholder="Enter faculty"
            onChange={(event) => setFaculty(event.target.value)}
            value={faculty}
          />
        </div>

        <hr />

        {Array.from({ length: numberOfCourses }).map((_, index) => (
          <CourseForm
            key={index}
            text={index}
            index={index}
            numberOfCourses={numberOfCourses}
            setNumberOfCourse={setNumberOfCourse}
            setCourseContent={setCourseContent}
          />
        ))}

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={increaseCourses}
        >
          Add one more course
        </button>

        <hr />

        <button type="button" className={`btn btn-primary ${classes.submit}`} onClick={apply}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default ApplyForm;
