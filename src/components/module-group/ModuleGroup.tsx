import React from 'react';
import {connect} from 'react-redux';
import {Column, Grid, Row} from 'carbon-components-react';
import {ModuleGroupModel} from '../../models';
import {Module} from '../module/Module';
import {Mode, selectMode} from '../../features/mode/modeSlice';
import {RootState} from '../../app/store';

interface ModuleGroupValues {
  mode: Mode
}

export interface ModuleGroupProps extends ModuleGroupValues {
  group: ModuleGroupModel
}

export interface ModuleGroupState {

}

class ModuleGroupInternal<S extends ModuleGroupState = any> extends React.Component<ModuleGroupProps, S> {

  render() {
    if (this.props.group.modules.length === 0) {
      return (<></>)
    }

    return (
      <div>
        <h4>{this.props.group.name}</h4>
        {this.renderTileModules()}
      </div>
    );
  }

  renderTileModules() {
    if (this.props.group.modules.length === 0) {
      return (<div>No modules</div>)
    }

    const moduleTiles = this.props.group.modules.map(m => <Module key={m.id} module={m}></Module>)

    return (
      <Grid>
        <Row>
          {moduleTiles.map(m => <Column lg={{span: 3}} md={{span: 4}} sm={{span: 4}}>{m}</Column>)}
        </Row>
      </Grid>
    )
  }
}

const mapStateToProps = (state: RootState): ModuleGroupValues => {

  const props = {
    mode: selectMode(state),
  }

  return props
}

export const ModuleGroup = connect(mapStateToProps)(ModuleGroupInternal)
