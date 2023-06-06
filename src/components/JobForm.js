import { useEffect, useState } from 'react';
import classes from './JobForm.module.scss';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { addJob, getJob, updateJob } from '../firebase';
import draftToHtml from 'draftjs-to-html';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import htmlToDraft from 'html-to-draftjs';
import { ContentState, convertToRaw, EditorState } from 'draft-js';

function JobForm({ id, email, action, cancel }) {
  const [position, setPosition] = useState('');
  const [venue, setVenue] = useState('');
  const [studentsRequired, setStudentRequired] = useState('');
  const [semester, setSemester] = useState('');
  const [hoursRequired, setHoursRequired] = useState('');
  const [type, setType] = useState('One Time');
  const [workDate, setWorkDate] = useState(new Date());
  const [workingDays, setWorkingDays] = useState([]);
  const [hourFrom, setHourFrom] = useState('9:00');
  const [hourTo, setHourTo] = useState('12:00');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [applicationPeriodFrom, setApplicationPeriodFrom] = useState(
    new Date()
  );
  const [applicationPeriodTo, setApplicationPeriodTo] = useState(new Date());

  useEffect(() => {
    const fillForm = async () => {
      const job = await getJob(id);
      console.log(job);
      setPosition(job.position);
      setVenue(job.venue);
      setStudentRequired(job.studentsRequired);
      setSemester(job.semester);
      setHoursRequired(job.hoursRequired);
      setType(job.type);
      setWorkingDays(job.workingDays ? job.workingDays : []);
      setHourFrom(job.workingHours.from);
      setHourTo(job.workingHours.to);
      setApplicationPeriodFrom(new Date(job.applicationPeriod.from.seconds * 1000));
      setApplicationPeriodTo(new Date(job.applicationPeriod.to.seconds * 1000));

      if (job.workDate) {
        setWorkDate(new Date(job.workDate.seconds * 1000));
      }
      if (job.startDate) {
        setStartDate(new Date(job.startDate.seconds * 1000));
      }
      if (job.endDate) {
        setEndDate(new Date(job.endDate.seconds * 1000));
      }

      const descriptionBlock = htmlToDraft(job.description);
      if (descriptionBlock) {
        const contentState = ContentState.createFromBlockArray(
          descriptionBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setDescription(editorState);
      }

      const requirementsBlock = htmlToDraft(job.requirements);
      if (requirementsBlock) {
        const contentState = ContentState.createFromBlockArray(
          requirementsBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setRequirements(editorState);
      }
    };

    if (id) {
      fillForm();
    }
  }, [id]);

  const saveJobHandler = () => {
    const workingHours = {
      from: hourFrom,
      to: hourTo,
    };
    const applicationPeriod = {
      from: applicationPeriodFrom,
      to: applicationPeriodTo,
    };
    const data = {
      applicationPeriod,
      position,
      venue,
      studentsRequired,
      semester,
      hoursRequired,
      type,
      workingHours,
      description: draftToHtml(convertToRaw(description.getCurrentContent())),
      requirements: draftToHtml(convertToRaw(requirements.getCurrentContent())),
      jobOwner: email,
    };

    if (type === 'One Time') {
      const day = new Date(workDate).toLocaleString(undefined, {
        weekday: 'short',
      });
      data.workDate = workDate;
      data.startDate = null;
      data.endDate = null;
      data.workingDays = [day];
      setWorkingDays([day]);
    } else if (type === 'Repeat') {
      data.workDate = null;
      data.startDate = startDate;
      data.endDate = endDate;
      data.workingDays = workingDays;
    }

    console.log(data);
    if (action === 'add') {
      addJob(data);
    } else if (action === 'edit') {
      updateJob(id, data);
    }
    cancel();
  };

  const onDaySelectedHandler = (event, day) => {
    if (workingDays.includes(day)) {
      const updatedSelectedDays = workingDays.filter(
        (selectedDay) => selectedDay !== day
      );
      setWorkingDays(updatedSelectedDays);
    } else {
      workingDays.push(day);
      setWorkingDays(workingDays);
    }
  };

  const onDescriptionChangeHandler = (editorState) => {
    setDescription(editorState);
  };

  const onRequirementsChangeHandler = (editorState) => {
    setRequirements(editorState);
  };

  return (
    <div className={classes['job-form']}>
      <h1>Job Details</h1>
      <form className="default-form">
        <div className="form-group">
          <label htmlFor="application-period">Application Period</label>
          <div className="days-container">
            <DatePicker
              selected={applicationPeriodFrom}
              onChange={(date) => setApplicationPeriodFrom(date)}
            />
            <p>to</p>
            <DatePicker
              selected={applicationPeriodTo}
              onChange={(date) => setApplicationPeriodTo(date)}
            />
          </div>
        </div>
        <div className="form-group span">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            id="position"
            name="position"
            placeholder="Enter position name"
            onChange={(event) => setPosition(event.target.value)}
            value={position}
          />
        </div>
        <div className="form-group">
          <label htmlFor="venue">Venue</label>
          <input
            type="text"
            id="venue"
            name="venue"
            placeholder="Enter venue name"
            onChange={(event) => setVenue(event.target.value)}
            value={venue}
          />
        </div>
        <div className="form-group">
          <label htmlFor="students-required">Students Required</label>
          <input
            type="number"
            id="students-required"
            name="students-required"
            placeholder="Enter number of students required"
            onChange={(event) => setStudentRequired(event.target.value)}
            value={studentsRequired}
          />
        </div>
        <div className="form-group">
          <label htmlFor="semester">Semester</label>
          <input
            type="text"
            id="semester"
            name="semester"
            placeholder="Enter semester"
            onChange={(event) => setSemester(event.target.value)}
            value={semester}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hours-required">Hours Required</label>
          <input
            type="number"
            id="hours-required"
            name="hours-required"
            placeholder="Enter number of hours required"
            onChange={(event) => setHoursRequired(event.target.value)}
            value={hoursRequired}
          />
        </div>
        <div className="form-group">
          <label htmlFor="working-hours">Type</label>
          <div className={classes.type}>
            <Form.Select
              onChange={(event) => setType(event.target.value)}
              value={type}
            >
              <option>One Time</option>
              <option>Repeat</option>
            </Form.Select>
          </div>
        </div>
        <div className="form-group"></div>
        {type === 'One Time' && (
          <div className="form-group">
            <label htmlFor="working-hours">Work Date</label>
            <DatePicker
              selected={workDate}
              onChange={(date) => setWorkDate(date)}
            />
          </div>
        )}
        {type === 'Repeat' && (
          <div className="form-group">
            <label htmlFor="working-days">Working Days</label>
            <div className="days-container">
              <Form.Check
                label="Mon"
                name="day"
                type="checkbox"
                onChange={(event) => onDaySelectedHandler(event, 'Mon')}
                defaultChecked={workingDays.includes('Mon')}
              />
              <Form.Check
                label="Tue"
                name="day"
                type="checkbox"
                onChange={(event) => onDaySelectedHandler(event, 'Tue')}
                defaultChecked={workingDays.includes('Tue')}
              />
              <Form.Check
                label="Wed"
                name="day"
                type="checkbox"
                onChange={(event) => onDaySelectedHandler(event, 'Wed')}
                defaultChecked={workingDays.includes('Wed')}
              />
              <Form.Check
                label="Thu"
                name="day"
                type="checkbox"
                onChange={(event) => onDaySelectedHandler(event, 'Thu')}
                defaultChecked={workingDays.includes('Thu')}
              />
              <Form.Check
                label="Fri"
                name="day"
                type="checkbox"
                onChange={(event) => onDaySelectedHandler(event, 'Fri')}
                defaultChecked={workingDays.includes('Fri')}
              />
              <Form.Check
                label="Sat"
                name="day"
                type="checkbox"
                onChange={(event) => onDaySelectedHandler(event, 'Sat')}
                defaultChecked={workingDays.includes('Sat')}
              />
              <Form.Check
                label="Sun"
                name="day"
                type="checkbox"
                onChange={(event) => onDaySelectedHandler(event, 'Sun')}
                defaultChecked={workingDays.includes('Sun')}
              />
            </div>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="working-hours">Working Hours</label>
          <div className="hours-container">
            <Form.Select
              onChange={(event) => setHourFrom(event.target.value)}
              value={hourFrom}
            >
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
            <Form.Select
              onChange={(event) => setHourTo(event.target.value)}
              value={hourTo}
            >
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
        {type === 'Repeat' && (
          <>
            <div className="form-group">
              <label htmlFor="working-hours">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="working-hours">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
          </>
        )}
        <div className="form-group span">
          <label htmlFor="description">Description</label>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorState={description}
            onEditorStateChange={onDescriptionChangeHandler}
          />
        </div>
        {/* <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(markup)}}></div> */}
        <div className="form-group span">
          <label htmlFor="requirements">Requirements</label>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorState={requirements}
            onEditorStateChange={onRequirementsChangeHandler}
          />
        </div>
        <div className={`${classes['form-action']} form-group span`}>
          <button
            type="button"
            className={classes.save}
            onClick={saveJobHandler}
          >
            Save
          </button>
          <button type="button" className={classes.cancel} onClick={cancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobForm;
