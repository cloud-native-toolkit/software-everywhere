import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

export enum Mode {
  tiles = 'tiles',
  table = 'table'
}

export interface ModeState {
  value: Mode
}

const initialState: ModeState = {
  value: Mode.table
}

export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    tableMode: (state: ModeState) => {
      state.value = Mode.table
    },
    tileMode: (state: ModeState) => {
      state.value = Mode.tiles
    }
  }
})

export const {tableMode, tileMode} = modeSlice.actions

export const selectMode = (state: RootState) => state.mode.value;

export default modeSlice.reducer;
