import {BomGroupModel} from './bom-group.model';

export interface BomCategoryModel {
  name: string
  displayName?: string;
  boms: BomGroupModel[]
}
