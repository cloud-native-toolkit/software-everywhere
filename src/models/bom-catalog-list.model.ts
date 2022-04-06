import {capitalize} from '../util/string-util';
import {BomCategoryModel} from './bom-category.model';

export interface ListValue {
  text: string;
  value: string;
}

export interface BomCatalogListModel {
  bomCategoryValues: ListValue[];
}

export const buildBomCatalogList = (): BomCatalogListModel => {
  return {
    bomCategoryValues: [
      {text: 'All categories', value: ''}
    ]
  }
}

export const withBomCategories = (bomCatalogList: BomCatalogListModel, bomCategories: BomCategoryModel[]): BomCatalogListModel => {
  if (!bomCategories || bomCategories.length === 0) {
    return bomCatalogList
  }

  const bomCategoryValues: ListValue[] = bomCategories.reduce((result: ListValue[], bomCategory: BomCategoryModel) => {
    const listValue: ListValue = {text: bomCategory.displayName || bomCategory.name, value: bomCategory.name}

    if (!result.map(l => l.value).includes(listValue.value)) {
      result.push(listValue)
    }

    return result
  }, bomCatalogList.bomCategoryValues.slice())

  return Object.assign(
    {},
    bomCatalogList,
    {
      bomCategoryValues
    }
  )
}
