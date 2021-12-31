import React from 'react';
import {ModuleModel, moduleUrl} from '../../models';

export interface ModuleLinkProps {
  module: ModuleModel;
  label?: string;
}

export class ModuleLink extends React.Component<ModuleLinkProps, any> {
  render() {
    const label: string = this.props.label || 'Source repo';

    return (
      (<a target="_blank" href={moduleUrl(this.props.module)}>{label}</a>)
    );
  }
}
