import { createSlice } from '@reduxjs/toolkit';

export const studentSlice = createSlice({
  name: 'student',
  initialState: {
    students: {},
    student: null,
  },
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    addStudent: (state, action) => {
      state.students.push(action.payload);
    },
    deleteStudent: (state, action) => {
      const id = action.payload;
      delete state.students[id];
    },
  },
});

export const { setStudents, addStudent, deleteStudent } = studentSlice.actions;
export default studentSlice.reducer;
