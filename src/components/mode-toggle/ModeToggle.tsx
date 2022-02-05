import React from 'react';
import {connect} from 'react-redux';
import {Button, ContentSwitcher, ContentSwitcherOnChangeData, Switch} from 'carbon-components-react';
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
  selected(mode: Mode): boolean {
    const result = mode === this.props.mode

    console.log(`Selected (${mode}): ${result}`)

    return result
  }

  switchContent(e: ContentSwitcherOnChangeData) {
    if (e.name === 'table') {
      this.props.tableMode()
    } else if (e.name === 'tiles') {
      this.props.tileMode()
    }
  }

  render() {
    return (
      <ContentSwitcher onChange={this.switchContent.bind(this)} style={{width: '200px'}}>
        <Switch name={'table'} text='Table' selected={this.selected(Mode.table)}/>
        <Switch name={'tiles'} text='Tiles' selected={this.selected(Mode.tiles)}/>
      </ContentSwitcher>
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
