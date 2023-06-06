import { createSlice } from '@reduxjs/toolkit';

export const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    staffs: {},
    staff: null,
  },
  reducers: {
    setStaffs: (state, action) => {
      state.staffs = action.payload;
    },
    addStaff: (state, action) => {
      state.staffs.push(action.payload);
    },
    deleteStaff: (state, action) => {
      const id = action.payload;
      delete state.staffs[id];
    },
  },
});

export const { setStaffs, addStaff, deleteStaff } = staffSlice.actions;
export default staffSlice.reducer;
