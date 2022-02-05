import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {buildCatalogList, CatalogListModel} from '../../models/catalog-list.model';
import {Status} from '../status';
import {RootState} from '../../app/store';
import {CatalogService} from '../../services';

export interface CatalogListState {
  value: CatalogListModel;
  status: Status;
}

const initialState: CatalogListState = {
  value: buildCatalogList(),
  status: Status.idle
}

const service: CatalogService = new CatalogService();

export const fetchCatalogList = createAsyncThunk(
  'catalog-list/fetch',
  async (): Promise<CatalogListModel> => {
    console.log('Fetching catalog list');
    return await service.fetchListValues();
  }
)

export const catalogListSlice = createSlice({
  name: 'catalog-list',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogList.pending, (state ) => {
        state.status = Status.loading;
      })
      .addCase(fetchCatalogList.fulfilled, (state, action: PayloadAction<CatalogListModel>) => {
        state.status = Status.idle;
        state.value = action.payload;
      })
  }
})

export const selectCatalogList = (state: RootState): CatalogListModel => state.catalogList.value

export default catalogListSlice.reducer
