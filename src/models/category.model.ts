import {ModuleGroupModel} from './module-group.model';

export interface CategoryModel {
  name: string
  displayName?: string;
  groups: ModuleGroupModel[]
}
