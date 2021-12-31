import React from 'react';
import {connect} from 'react-redux';

import {ModuleGroup} from '../module-group/ModuleGroup';
import {CategoryModel, ModuleGroupModel} from '../../models';
import {Mode, selectMode} from '../../features/mode/modeSlice';
import {RootState} from '../../app/store';
import {ModuleGroupTable} from '../module-group/ModuleGroupTable';

interface CategoryValues {
  mode: Mode
}

export interface CategoryProps extends CategoryValues {
  category: CategoryModel
}

export interface CategoryState {
}

class CategoryInternal<S extends CategoryState> extends React.Component<CategoryProps, S> {
  render() {
    if (this.moduleCount(this.props.category.groups) === 0) {
      return (<></>)
    }

    return (
      <>
      <h3>{this.props.category.name}</h3>
      {this.renderModuleGroups()}
      </>
    );
  }

  moduleCount(groups: ModuleGroupModel[] = []): number {
    return groups.reduce((count: number, group: ModuleGroupModel) => {
      return count + group.modules.length;
    }, 0)
  }

  renderModuleGroups() {
    if (this.props.category.groups.length === 0) {
      return (<div>No modules</div>)
    }

    return this.props.mode === Mode.table ? this.renderModuleGroupTables() : this.renderModuleGroupTiles()
  }

  renderModuleGroupTables() {
    return (
      <ModuleGroupTable groups={this.props.category.groups} category={this.props.category.name}></ModuleGroupTable>
    )
  }

  renderModuleGroupTiles() {
    return this.props.category.groups.map(m => <ModuleGroup key={m.name} group={m}></ModuleGroup>)
  }
}

const mapStateToProps = (state: RootState): CategoryValues => {

  const props = {
    mode: selectMode(state),
  }

  return props
}

export const Category = connect(mapStateToProps)(CategoryInternal)
