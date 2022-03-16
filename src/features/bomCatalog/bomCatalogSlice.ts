import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../../app/store';
import {BomCatalogModel, BomCatalogFiltersModel, BomCatalogResultModel} from '../../models';
import {BomService} from '../../services';
import {Status} from '../status';

export interface BomCatalogState {
  value?: BomCatalogModel
  status: Status
}

const initialState: BomCatalogState = {
  value: undefined,
  status: Status.idle
}

const service: BomService = new BomService();

export const filterBomCatalogAsync = createAsyncThunk(
  'bomCatalog/fetch',
  async (bomCatalogFilters?: BomCatalogFiltersModel): Promise<BomCatalogResultModel> => {
    console.log('Fetching Bom Catalog')
    return await (service.fetch(bomCatalogFilters))
  }
)

export const bomCatalogSlice = createSlice({
  name: 'bomCatalog',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterBomCatalogAsync.pending, (state) => {
        console.log('Loading Bom Catalog')
        state.status = Status.loading;
      })
      .addCase(filterBomCatalogAsync.fulfilled, (state, action: PayloadAction<BomCatalogResultModel>) => {
        console.log('Bom Catalog loaded')
        state.status = Status.idle;
        state.value = action.payload.payload;
      });

  }
})

export const selectBomCatalog = (state: RootState): BomCatalogModel | undefined => state.bomCatalog.value
export const selectBomCatalogStatus = (state: RootState): Status | undefined => state.bomCatalog.status

export default bomCatalogSlice.reducer
