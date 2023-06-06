import { createSlice } from '@reduxjs/toolkit';

export const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: {},
    job: null,
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    addJob: (state, action) => {
      state.jobs.push(action.payload);
    },
    deleteJob: (state, action) => {
      const id = action.payload;
      delete state.jobs[id];
    },
  },
});

export const { setJobs, addJob, deleteJob } = jobSlice.actions;
export default jobSlice.reducer;
