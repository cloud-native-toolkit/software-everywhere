import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../../app/store';
import {CatalogFiltersModel, CatalogModel, CatalogResultModel} from '../../models';
import {CatalogService} from '../../services/catalog/catalog.service';
import {Status} from '../status';

export interface CatalogState {
  value?: CatalogModel
  filters?: CatalogFiltersModel
  status: Status
}

const initialState: CatalogState = {
  value: undefined,
  filters: {},
  status: Status.idle
}

const service: CatalogService = new CatalogService();

export const filterCatalogAsync = createAsyncThunk(
  'catalog/fetch',
  async (catalogFilters?: CatalogFiltersModel): Promise<CatalogResultModel> => {
    console.log('Fetching catalog')
    return await (service.fetch(catalogFilters))
  }
)

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterCatalogAsync.pending, (state) => {
        console.log('Loading catalog')
        state.status = Status.loading;
      })
      .addCase(filterCatalogAsync.fulfilled, (state, action: PayloadAction<CatalogResultModel>) => {
        console.log('Catalog loaded')
        state.status = Status.idle;
        state.value = action.payload.payload;
        state.filters = action.payload.filters;
      });

  }
})

export const selectCatalog = (state: RootState): CatalogModel | undefined => state.catalog.value
export const selectCatalogFilters = (state: RootState): CatalogFiltersModel | undefined => state.catalog.filters
export const selectCatalogStatus = (state: RootState): Status | undefined => state.catalog.status

export default catalogSlice.reducer
