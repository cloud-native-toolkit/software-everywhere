import React from 'react';

import {DataTable, HeaderData} from '../../ui-patterns/data-table/DataTable';
import {
  moduleBuildBadgeUrl,
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
  key: 'link'
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
  header: 'Build',
  key: 'buildBadge'
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
  buildBadge: any;
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
              latestVersion: moduleLatestVersion(m),
              buildBadge: this.moduleBuildBadge(m)
            }
          ))
        )

        return modules;
      },
      []
    );
  }

  moduleBuildBadge(module: ModuleModel) {
    const imgUrl = moduleBuildBadgeUrl(module)

    return (
      <img src={imgUrl} />
    )
  }

  moduleLink(module: ModuleModel) {
    return (<ModuleLink module={module} label={module.name} />)
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
