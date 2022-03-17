import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import catalogReducer from '../features/catalog/catalogSlice';
import catalogListReducer from '../features/catalog-list/catalogListSlice';
import modeReducer from '../features/mode/modeSlice';
import bomCatalogReducer from '../features/bomCatalog/bomCatalogSlice';
import {markdownReducer} from '../features/markdown/markdownSlice'
import bomCatalogListReducer from '../features/bom-catalog-list/bomCatalogListSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    catalog: catalogReducer,
    catalogList: catalogListReducer,
    markdown: markdownReducer,
    mode: modeReducer,
    bomCatalog: bomCatalogReducer,
    bomCatalogList: bomCatalogListReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
