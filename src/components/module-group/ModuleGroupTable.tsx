import React from 'react';

import {DataTable, HeaderData} from '../../ui-patterns/data-table/DataTable';
import {
  moduleDisplayName,
  ModuleGroupModel, moduleLatestVersion,
  ModuleModel,
  moduleProvider,
  moduleStatus,
  moduleType,
  moduleUrl
} from '../../models';
import {ModuleLink} from '../module-link';

const headers: HeaderData<EnhancedModuleModel>[] = [{
  header: 'Module',
  key: 'displayName'
}, {
  header: 'Name',
  key: 'name'
}, {
  header: 'Group',
  key: 'group'
}, {
  header: 'Latest version',
  key: 'latestVersion'
}, {
  header: 'Type',
  key: 'type'
}, {
  header: 'Status',
  key: 'status'
}, {
  header: 'Provider',
  key: 'provider'
}, {
  header: 'Url',
  key: 'link'
}];

interface ModuleTableProps {
  groups: ModuleGroupModel[];
  category: string;
}

interface EnhancedModuleModel extends ModuleModel {
  status: string;
  url: string;
  link: any;
  provider: string;
  latestVersion: string;
}

export class ModuleGroupTable extends React.Component<ModuleTableProps, any> {

  get modules(): EnhancedModuleModel[] {
    return this.props.groups.reduce(
      (modules: EnhancedModuleModel[], group: ModuleGroupModel) => {
        modules.push(...group.modules
          .map(m => Object.assign(
            {},
            m,
            {
              group: group.name,
              url: moduleUrl(m),
              status: moduleStatus(m),
              displayName: moduleDisplayName(m),
              type: moduleType(m),
              link: this.moduleLink(m),
              provider: moduleProvider(m),
              latestVersion: moduleLatestVersion(m)
            }
          ))
        )

        return modules;
      },
      []
    );
  }

  moduleLink(module: ModuleModel) {
    return (<ModuleLink module={module} />)
  }

  get title(): string {
    return this.props.category
  }

  render() {
    return (
      <DataTable headers={headers} data={this.modules} title=""></DataTable>
    )
  }
}
