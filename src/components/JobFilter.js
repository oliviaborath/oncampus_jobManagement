import classes from './JobFilter.module.scss';
import { useState } from 'react';

// React Bootstrap
import Dropdown from 'react-bootstrap/Dropdown';

function JobFilter() {
  const [dayDropdown, setDayDropdown] = useState('Day');
  const [hourDropdown, setHourDropdown] = useState('Working Hour');
  const [typeDropdown, setTypeDropdown] = useState('Type');
  const [sortDropdown, setSortDropdown] = useState('Sort');

  return (
    <div className={classes['job-filter']}>
      <Dropdown className={classes['dropdown']}>
        <Dropdown.Toggle variant="primary" id="dropdown-day">
          {dayDropdown}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setDayDropdown('Option 1')}>
            Option 1
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDayDropdown('Option 2')}>
            Option 2
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDayDropdown('Option 3')}>
            Option 3
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown className={classes['dropdown']}>
        <Dropdown.Toggle variant="primary" id="dropdown-hour">
          {hourDropdown}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setHourDropdown('Option 1')}>
            Option 1
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setHourDropdown('Option 2')}>
            Option 2
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setHourDropdown('Option 3')}>
            Option 3
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown className={classes['dropdown']}>
        <Dropdown.Toggle variant="primary" id="dropdown-type">
          {typeDropdown}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setTypeDropdown('Option 1')}>
            Option 1
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setTypeDropdown('Option 2')}>
            Option 2
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setTypeDropdown('Option 3')}>
            Option 3
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown className={classes['dropdown']}>
        <Dropdown.Toggle variant="primary" id="dropdown-sort">
          {sortDropdown}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSortDropdown('Option 1')}>
            Option 1
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSortDropdown('Option 2')}>
            Option 2
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSortDropdown('Option 3')}>
            Option 3
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default JobFilter;
