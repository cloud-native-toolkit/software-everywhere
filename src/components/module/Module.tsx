import React from 'react';
import {Tile} from 'carbon-components-react';

import './Module.scss'
import {ModuleModel, moduleUrl, moduleStatus, moduleDisplayName, moduleType} from '../../models';
import {Mode, selectMode} from '../../features/mode/modeSlice';
import first from '../../util/first';
import {semanticVersionDescending, semanticVersionFromString} from '../../util/semantic-version';
import {RootState} from '../../app/store';
import {connect} from 'react-redux';
import {ModuleLink} from '../module-link/ModuleLink';

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
        <div className="TileRow"><span className="Label">Name:</span> {this.moduleName}</div>
        <div className="TileRow"><span className="Label">Type:</span> {this.moduleType}</div>
        <div className="TileRow"><span className="Label">Status:</span> {this.moduleStatus}</div>
        <div className="TileRow">{this.moduleLink}</div>
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

  get moduleLink() {
    return (<ModuleLink module={this.props.module} />)
  }
}

const mapStateToProps = (state: RootState): ModuleValues => {

  const props = {
    mode: selectMode(state),
  }

  return props
}

export const Module = connect(mapStateToProps)(ModuleInternal)
