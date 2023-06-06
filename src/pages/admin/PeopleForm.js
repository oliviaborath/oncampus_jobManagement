import { useEffect } from 'react';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import CourseForm from '../../components/CourseForm';
import {
  addStaff,
  addStudent,
  registerWithEmailAndPassword,
  updateStaff,
  updateStudent,
} from '../../firebase';
import classes from './PeopleForm.module.scss';

function PeopleForm({ mode, close, fetchData, data }) {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [id, setId] = useState('');
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [hoursRequired, setHoursRequired] = useState('');
  const [numberOfCourses, setNumberOfCourse] = useState(1);
  const [courses, setCourses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setEmail(data.email);
      setRole(data.role);
      setId(data.id);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      if (data.role === 'student') {
        setFaculty(data.faculty);
        setSemester(data.semester);
        setCourses(data.courses);
        setHoursRequired(data.hoursRequired);
      }

      if (data.role === 'staff') {
        setDepartment(data.department);
      }
    }

    if (mode === 'add') {
      setRole('student');
    }
  }, [data, mode]);

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
  };

  const removeCourse = (index) => {
    const coursesCopy = [...courses];
    coursesCopy.splice(index, 1);
    setNumberOfCourse(coursesCopy.length);
    setCourses(coursesCopy);
  };

  const saveItem = async () => {
    setIsSaving(true);
    let data;

    if (role === 'student') {
      data = {
        email,
        firstName,
        lastName,
        id,
        role,
        faculty,
        semester,
        courses,
        hoursRequired,
      };
    } else if (role === 'staff') {
      data = {
        email,
        firstName,
        lastName,
        id,
        role,
        department,
      };
    }

    console.log(data);

    if (mode === 'add') {
      if (role === 'student') {
        await addStudent(data);
      } else if (role === 'staff') {
        await addStaff(data);
      }
      await registerWithEmailAndPassword(email, password);
    } else if (mode === 'edit') {
      if (role === 'student') {
        updateStudent(email, data);
      } else if (role === 'staff') {
        updateStaff(email, data);
      }
      await fetchData();
    }
    setIsSaving(false);
    close();
  };

  return (
    <div className={classes['add-item']}>
      {mode === 'add' && (
        <div className={classes['types']}>
          <div
            className={`${classes['slider']} ${
              role === 'staff' ? classes['right'] : ''
            }`}
          />
          <button
            onClick={() => setRole('student')}
            className={`${role === 'student' ? classes['active'] : ''}`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('staff')}
            className={`${role === 'staff' ? classes['active'] : ''}`}
          >
            Staff
          </button>
        </div>
      )}

      <form className="default-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          {mode === 'add' && (
            <>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input
            type="text"
            name="id"
            placeholder="Enter id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        {role === 'student' && (
          <div className="form-group">
            <label htmlFor="faculty">Faculty</label>
            <input
              type="text"
              name="faculty"
              placeholder="Enter faculty"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            />
          </div>
        )}
        {role === 'staff' && (
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              name="department"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        {role === 'student' && (
          <>
            <div className="form-group">
              <label htmlFor="semester">Semester</label>
              <input
                type="text"
                name="semester"
                placeholder="Enter semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="hours-required">Hours Required</label>
              <input
                type="number"
                name="hours-required"
                placeholder="Enter hours required"
                value={hoursRequired}
                onChange={(e) => setHoursRequired(e.target.value)}
              />
            </div>
          </>
        )}

        {role === 'student' &&
          !data &&
          Array.from({ length: numberOfCourses }).map((_, index) => (
            <CourseForm
              key={index}
              text={index}
              index={index}
              numberOfCourses={numberOfCourses}
              setNumberOfCourse={setNumberOfCourse}
              setCourseContent={setCourseContent}
              removeCourse={removeCourse}
            />
          ))}

        {role === 'student' &&
          data &&
          courses.map((course, index) => (
            <CourseForm
              key={index}
              text={index}
              index={index}
              numberOfCourses={numberOfCourses}
              setNumberOfCourse={setNumberOfCourse}
              setCourseContent={setCourseContent}
              removeCourse={removeCourse}
              data={course}
            />
          ))}

        {role === 'student' && (
          <div className="form-group">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={increaseCourses}
            >
              Add one more course
            </button>
          </div>
        )}

        <div className={`${classes['actions']} form-group span`}>
          <button type="button" onClick={saveItem}>
            {!isSaving && 'Save'}
            {isSaving && <Spinner as="span" animation="border" size="sm" />}
          </button>
          <button type="button" onClick={close} className={classes.close}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default PeopleForm;
