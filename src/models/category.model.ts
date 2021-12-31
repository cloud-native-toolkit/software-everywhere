import {ModuleGroupModel} from './module-group.model';

export interface CategoryModel {
  name: string
  groups: ModuleGroupModel[]
}
