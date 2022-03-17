import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {buildBomCatalogList, BomCatalogListModel} from '../../models/bom-catalog-list.model';
import {Status} from '../status';
import {RootState} from '../../app/store';
import {BomService} from '../../services';

export interface BomCatalogListState {
  value: BomCatalogListModel;
  status: Status;
}

const initialState: BomCatalogListState = {
  value: buildBomCatalogList(),
  status: Status.idle
}

const service: BomService = new BomService();

export const fetchBomCatalogList = createAsyncThunk(
  'bom-catalog-list/fetch',
  async (): Promise<BomCatalogListModel> => {
    console.log('Fetching bom catalog list');
    return await service.fetchListValues();
  }
)

export const bomCatalogListSlice = createSlice({
  name: 'bom-catalog-list',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBomCatalogList.pending, (state ) => {
        state.status = Status.loading;
      })
      .addCase(fetchBomCatalogList.fulfilled, (state, action: PayloadAction<BomCatalogListModel>) => {
        state.status = Status.idle;
        state.value = action.payload;
      })
  }
})

export const selectBomCatalogList = (state: RootState): BomCatalogListModel => state.bomCatalogList.value

export default bomCatalogListSlice.reducer
