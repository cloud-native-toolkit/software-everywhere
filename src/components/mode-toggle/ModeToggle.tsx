import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'carbon-components-react';
import {RootState} from '../../app/store';
import {Mode, selectMode, tableMode, tileMode} from '../../features/mode/modeSlice';

interface ModeToggleValues {
  mode: Mode
}

interface ModeToggleDispatch {
  tableMode: () => void,
  tileMode: () => void
}

export interface ModeToggleProps extends ModeToggleValues, ModeToggleDispatch {
}

class ModeToggleInternal extends React.Component<ModeToggleProps, any> {
  render() {
    return (
      <div style={{overflow: 'auto'}}>
        <div style={{float: 'right'}}><Button kind="tertiary" disabled={this.props.mode === Mode.table} onClick={this.props.tableMode} size={"field"}>Table</Button></div>
        <div style={{float: 'right'}}><Button kind="tertiary" disabled={this.props.mode === Mode.tiles} onClick={this.props.tileMode} size={"field"}>Tiles</Button></div>
      </div>
    )
  }
}


const mapStateToProps = (state: RootState): ModeToggleValues => {

  const props: ModeToggleValues = {
    mode: selectMode(state),
  }

  return props
}

const mapDispatchToProps = (dispatch: any): ModeToggleDispatch => {
  return {
    tableMode: () => dispatch(tableMode()),
    tileMode: () => dispatch(tileMode())
  }
}

export const ModeToggle = connect(mapStateToProps, mapDispatchToProps)(ModeToggleInternal)
