import { configureStore } from '@reduxjs/toolkit';
import { jobSlice } from './jobSlice';
import { staffSlice } from './staffSlice';
import { studentSlice } from './studentSlice';

export default configureStore({
  reducer: {
    student: studentSlice.reducer,
    staff: staffSlice.reducer,
    job: jobSlice.reducer,
  },
});
