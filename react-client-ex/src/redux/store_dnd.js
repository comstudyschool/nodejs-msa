// src/redux/store_dnd.js
import { createSlice } from '@reduxjs/toolkit';

const positionSlice = createSlice({
  name: 'position',
  initialState: { x: 100, y: 100 },  // 초기 위치 설정
  reducers: {
    setPosition: (state, action) => {
      state.x = action.payload.x;
      state.y = action.payload.y;
    }
  }
});

export const { setPosition } = positionSlice.actions;
export default positionSlice.reducer;