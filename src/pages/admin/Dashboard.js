import React, { useEffect, useState } from 'react';
import PeopleForm from './PeopleForm';
import classes from './Dashboard.module.scss';
import {
  deleteStaff,
  deleteStudent,
  getStaffs,
  getStudents,
} from '../../firebase';
import JobList from '../../components/JobList';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

function Dashboard({ role }) {
  const [addItem, setAddItem] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [students, setStudents] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [searchedStaffs, setSearchedStaffs] = useState([]);
  const [searchedStudents, setSearchedStudents] = useState([]);
  const [staffQuery, setStaffQuery] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [data, setData] = useState([]);
  const [staffPages, setStaffPages] = useState(1);
  const [currentStaffPage, setCurrentStaffPage] = useState(1);
  const [studentPages, setStudentPages] = useState(1);
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [studentLoading, setStudentLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      return navigate('/');
    }

    const fetchData = async () => {
      const staffs = await getStaffs();
      setStaffs(staffs);
      setSearchedStaffs(staffs);
      setStaffPages(
        staffs.length % 9 === 0 ? staffs.length / 9 : staffs.length / 9 + 1
      );
      setStaffLoading(false);

      const students = await getStudents();
      setStudents(students);
      setSearchedStudents(students);
      setStudentPages(
        students.length % 9 === 0
          ? students.length / 9
          : students.length / 9 + 1
      );
      setStudentLoading(false);
    };

    fetchData();
  }, [role, navigate, data]);

  const fetchData = async () => {
    setStaffLoading(true);
    setStudentLoading(true);
    const staffs = await getStaffs();
    setStaffs(staffs);
    setStaffPages(
      staffs.length % 9 === 0 ? staffs.length / 9 : staffs.length / 9 + 1
    );
    setStaffLoading(false);

    const students = await getStudents();
    setStudents(students);
    setStudentPages(
      students.length % 9 === 0 ? students.length / 9 : students.length / 9 + 1
    );
    setStudentLoading(false);
  };

  const editHandler = (data, role) => {
    setEditItem(true);
    data.role = role;
    setData(data);
    window.scrollTo(0, 0);
  };

  const changeStudentPageHandler = (page) => {
    setCurrentStudentPage(page);
  };

  const changeStaffPageHandler = (page) => {
    setCurrentStaffPage(page);
  };

  const deleteStudentHandler = (student) => {
    setSelectedUser(student);
    setOpenModal(true);
  };

  const deleteStaffHandler = (staff) => {
    setSelectedUser(staff);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (selectedUser.role === 'student') {
      await deleteStudent(selectedUser.uid);
    } else if (selectedUser.role === 'staff') {
      await deleteStaff(selectedUser.uid);
    }
    await fetchData();
    setOpenModal(false);
  };

  const searchStaffs = () => {
    const updatedSearchedJobs = staffs.filter(
      (staff) =>
        `${staff.firstName} ${staff.lastName}`
          .toLowerCase()
          .includes(staffQuery.toLowerCase()) ||
        staff.firstName.toLowerCase().includes(staffQuery.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(staffQuery.toLowerCase()) ||
        staff.id.toLowerCase().includes(staffQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(staffQuery.toLowerCase())
    );
    setSearchedStaffs(updatedSearchedJobs);
    setStaffPages(
      updatedSearchedJobs.length % 9 === 0
        ? updatedSearchedJobs.length / 9
        : updatedSearchedJobs.length / 9 + 1
    );
  };

  const searchStudents = () => {
    const updatedSearchedJobs = students.filter(
      (student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(studentQuery.toLowerCase()) ||
        student.firstName.toLowerCase().includes(studentQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(studentQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(studentQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(studentQuery.toLowerCase())
    );
    setSearchedStudents(updatedSearchedJobs);
    setStudentPages(
      updatedSearchedJobs.length % 9 === 0
        ? updatedSearchedJobs.length / 9
        : updatedSearchedJobs.length / 9 + 1
    );
  };

  const studentList = searchedStudents.map((student, index) => {
    return (
      <React.Fragment key={index}>
        {index >= (currentStudentPage - 1) * 9 &&
          index < currentStudentPage * 9 && (
            <div className={classes.item}>
              <p className={classes.id}>
                <span>ID:</span>
                {student.id}
              </p>
              <p className={classes.name}>
                <span>Name:</span>
                {student.firstName} {student.lastName}
              </p>
              <p className={classes.email}>
                <span>Email:</span>
                {student.email}
              </p>
              {!editItem && (
                <div className={classes.actions}>
                  <button onClick={() => editHandler(student, 'student')}>
                    Edit
                  </button>
                  <button
                    className={classes.delete}
                    onClick={() => deleteStudentHandler(student)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
      </React.Fragment>
    );
  });

  const staffList = searchedStaffs.map((staff, index) => {
    return (
      <React.Fragment key={index}>
        {index >= (currentStaffPage - 1) * 9 &&
          index < currentStaffPage * 9 && (
            <div key={index} className={classes.item}>
              <p className={classes.id}>
                <span>ID:</span>
                {staff.id}
              </p>
              <p className={classes.name}>
                <span>Name:</span>
                {staff.firstName} {staff.lastName}
              </p>
              <p className={classes.email}>
                <span>Email:</span>
                {staff.email}
              </p>
              {!editItem && (
                <div className={classes.actions}>
                  <button onClick={() => editHandler(staff, 'staff')}>
                    Edit
                  </button>
                  <button
                    className={classes.delete}
                    onClick={() => deleteStaffHandler(staff)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
      </React.Fragment>
    );
  });

  return (
    <div className={classes.dashboard}>
      {!addItem && (
        <button
          onClick={() => setAddItem(true)}
          className={classes['add-item']}
        >
          Add Student/Staff
        </button>
      )}
      {addItem && (
        <PeopleForm
          mode="add"
          close={() => setAddItem(false)}
          fetchData={fetchData}
        />
      )}
      {editItem && (
        <PeopleForm
          mode="edit"
          close={() => setEditItem(false)}
          data={data}
          fetchData={fetchData}
        />
      )}
      <div className={classes.search}>
        <input
          type="text"
          placeholder="Search staffs"
          value={staffQuery}
          onChange={(event) => setStaffQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && searchStaffs()}
        />
        <button className="btn btn-primary" onClick={searchStaffs}>
          Search
        </button>
      </div>
      <h2>Staffs List</h2>
      {staffLoading && <Spinner animation="border" variant="primary" />}
      {staffs.length > 0 && (
        <>
          <div className={classes.list}>{staffList}</div>
          <div className="pagination">
            {Array.from({ length: staffPages }).map((_, index) => (
              <p
                className={`page ${
                  index + 1 === currentStaffPage ? 'active' : ''
                }`}
                key={index}
                onClick={() => changeStaffPageHandler(index + 1)}
              >
                {index + 1}
              </p>
            ))}
          </div>
        </>
      )}
      <div className={classes.search}>
        <input
          type="text"
          placeholder="Search students"
          value={studentQuery}
          onChange={(event) => setStudentQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && searchStudents()}
        />
        <button className="btn btn-primary" onClick={searchStudents}>
          Search
        </button>
      </div>
      <h2>Students List</h2>
      {studentLoading && <Spinner animation="border" variant="primary" />}
      {students.length > 0 && (
        <>
          <div className={classes.list}>{studentList}</div>
          <div className="pagination">
            {Array.from({ length: studentPages }).map((_, index) => (
              <p
                className={`page ${
                  index + 1 === currentStudentPage ? 'active' : ''
                }`}
                key={index}
                onClick={() => changeStudentPageHandler(index + 1)}
              >
                {index + 1}
              </p>
            ))}
          </div>
        </>
      )}
      <JobList role="admin" />
      <div
        className={`${classes['modal-container']} 
        ${openModal ? classes.open : ''}`}
      >
        <div className={classes['modal-background']}></div>
        <div className={classes.modal}>
          <h3 className="text-center my-4">
            Are you sure you want to delete {selectedUser.firstName}{' '}
            {selectedUser.lastName}?
          </h3>
          <div className={classes.buttons}>
            <button className="btn btn-primary" onClick={confirmDelete}>
              Yes
            </button>
            <button
              className="btn btn-gray"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
