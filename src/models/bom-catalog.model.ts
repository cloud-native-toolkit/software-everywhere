import {BomCategoryModel} from './bom-category.model';

export interface BomCatalogFiltersModel {
  category?: string;
}

export interface BomCatalogResultModel {
  payload: BomCatalogModel;
  filters?: BomCatalogFiltersModel;
  totalCount: number;
  count: number;
}

export interface BomCatalogModel {
  categories: BomCategoryModel[];
}
