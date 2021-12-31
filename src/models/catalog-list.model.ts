import {capitalize} from '../util/string-util';

export interface ListValue {
  text: string;
  value: string;
}

export interface CatalogListModel {
  cloudProviderValues: ListValue[];
  softwareProviderValues: ListValue[];
  moduleTypeValues: ListValue[];
  statusValues: ListValue[];
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
    ]
  }
}

export const addSoftwareProvider = (catalogList: CatalogListModel, value: string, text?: string) => {
  if (catalogList.softwareProviderValues.map(v => v.value).includes(value)) {
    return;
  }

  catalogList.softwareProviderValues.push({value, text: capitalize(text || value)});
}


export class CatalogList1 implements CatalogListModel {
  cloudProviderValues: ListValue[] = [];
  softwareProviderValues: ListValue[] = [];
  moduleTypeValues: ListValue[] = [];
  statusValues: ListValue[] = [];

  constructor() {
    this.cloudProviderValues = [
      {text: 'All providers', value: ''},
      {text: 'IBM', value: 'ibm'},
      {text: 'AWS', value: 'aws'},
      {text: 'Azure', value: 'azure'}
    ]

    this.moduleTypeValues = [
      {text: 'All types', value: ''},
      {text: 'Terraform', value: 'terraform'},
      {text: 'GitOps', value: 'gitops'}
    ]

    this.statusValues = [
      {text: 'All statuses', value: ''},
      {text: 'Released', value: 'released'},
      {text: 'Beta', value: 'beta'},
      {text: 'Pending', value: 'pending'}
    ]

    this.softwareProviderValues = [
      {text: 'All providers', value: ''},
      {text: 'IBM Cloud Pak', value: 'ibm-cp'}
    ]
  }

  addSoftwareProvider(value: string, text?: string) {
    if (this.softwareProviderValues.map(v => v.value).includes(value)) {
      return;
    }

    this.softwareProviderValues.push({value, text: capitalize(text || value)});
  }

  asValues(): CatalogListModel {
    return {
      cloudProviderValues: this.cloudProviderValues,
      softwareProviderValues: this.softwareProviderValues,
      moduleTypeValues: this.moduleTypeValues,
      statusValues: this.statusValues
    }
  }
}
