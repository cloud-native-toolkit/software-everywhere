import {capitalize} from '../util/string-util';
import {CategoryModel} from './category.model';

export interface ListValue {
  text: string;
  value: string;
}

export interface CatalogListModel {
  cloudProviderValues: ListValue[];
  softwareProviderValues: ListValue[];
  moduleTypeValues: ListValue[];
  statusValues: ListValue[];
  categoryValues: ListValue[];
}

export const buildCatalogList = (): CatalogListModel => {
  return {
    cloudProviderValues: [
      {text: 'All providers', value: ''},
      {text: 'IBM', value: 'ibm'},
      {text: 'AWS', value: 'aws'},
      {text: 'Azure', value: 'azure'}
    ],
    moduleTypeValues: [
      {text: 'All types', value: ''},
      {text: 'Terraform', value: 'terraform'},
      {text: 'GitOps', value: 'gitops'}
    ],
    statusValues: [
      {text: 'All statuses', value: ''},
      {text: 'Released', value: 'released'},
      {text: 'Beta', value: 'beta'},
      {text: 'Pending', value: 'pending'}
    ],
    softwareProviderValues: [
      {text: 'All providers', value: ''},
      {text: 'IBM Cloud Pak', value: 'ibm-cp'}
    ],
    categoryValues: [
      {text: 'All categories', value: ''}
    ]
  }
}

export const addSoftwareProvider = (catalogList: CatalogListModel, value: string, text?: string) => {
  if (catalogList.softwareProviderValues.map(v => v.value).includes(value)) {
    return;
  }

  catalogList.softwareProviderValues.push({value, text: capitalize(text || value)});
}

export const withCategories = (catalogList: CatalogListModel, categories: CategoryModel[]): CatalogListModel => {
  if (!categories || categories.length === 0) {
    return catalogList
  }

  const categoryValues: ListValue[] = categories.reduce((result: ListValue[], category: CategoryModel) => {
    const listValue: ListValue = {text: category.displayName || category.name, value: category.name}

    if (!result.map(l => l.value).includes(listValue.value)) {
      result.push(listValue)
    }

    return result
  }, catalogList.categoryValues.slice())

  return Object.assign(
    {},
    catalogList,
    {
      categoryValues
    }
  )
}
