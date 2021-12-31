import {CategoryModel} from './category.model';

export interface CatalogFiltersModel {
  cloudProvider?: string;
  moduleType?: string;
  softwareProvider?: string;
  searchText?: string;
  status?: string;
}

export interface CatalogResultModel {
  payload: CatalogModel;
  filters?: CatalogFiltersModel;
}

export interface CatalogModel {
  categories: CategoryModel[];
}
