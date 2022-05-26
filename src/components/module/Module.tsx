import React from 'react';
import {Tile} from 'carbon-components-react';
import {connect} from 'react-redux';

import './Module.scss'
import {RootState} from '../../app/store';
import {Mode, selectMode} from '../../features/mode/modeSlice';
import {
  moduleBuildBadgeUrl,
  moduleDisplayName,
  moduleLatestVersion,
  ModuleModel,
  moduleStatus,
  moduleType,
  moduleUrl
} from '../../models';
import {ModuleLink} from '../module-link';

interface ModuleValues {
  mode: Mode
}

export interface ModuleProps extends ModuleValues {
  module: ModuleModel
}

class ModuleInternal extends React.Component<ModuleProps, any> {
  render() {
    return this.renderTile()
  }

  renderTile() {
    return (
      <Tile className="Module">
        {this.badge()}
        <div className="TileRow"><span className="Label">{this.moduleDisplayName}</span></div>
        <div className="TileRow"><span className="Label">Name:</span> {this.moduleLink}</div>
        <div className="TileRow"><span className="Label">Type:</span> {this.moduleType}</div>
        <div className="TileRow"><span className="Label">Status:</span> {this.moduleStatus}</div>
        <div className="TileRow"><span className="Label">Latest version:</span> {this.moduleLatestVersion}</div>
        <div className="TileRow">{this.moduleBuildBadge}</div>
      </Tile>
    );
  }

  badge() {
    if (!this.props.module.cloudProvider) {
      return (<></>)
    }

    return (
      <div style={{float: 'right', zIndex: 100}}><img src={`images/${this.props.module.cloudProvider}.png`} /></div>
    )
  }

  get moduleDisplayName(): string {
    return moduleDisplayName(this.props.module)
  }

  get moduleName(): string {
    return this.props.module.name
  }

  get moduleType(): string {
    return moduleType(this.props.module)
  }

  get moduleUrl(): string {
    return moduleUrl(this.props.module)
  }

  get moduleStatus(): string {
    return moduleStatus(this.props.module)
  }

  get moduleLatestVersion(): string {
    return moduleLatestVersion(this.props.module)
  }

  get moduleLink() {
    return (<ModuleLink module={this.props.module} label={this.props.module.name}/>)
  }

  get moduleBuildBadge() {
    const imgUrl = moduleBuildBadgeUrl(this.props.module)

    return (
      <img src={imgUrl} />
    )
  }
}

const mapStateToProps = (state: RootState): ModuleValues => {

  const props = {
    mode: selectMode(state),
  }

  return props
}

export const Module = connect(mapStateToProps)(ModuleInternal)
