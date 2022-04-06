import React from 'react';

import {BomGroup} from '../bom-group';

import {BomCategoryModel, BomGroupModel} from '../../models';

import './BomCategory.scss';

export interface BomCategoryState {
}

export interface BomCategoryProps {
  bomCategory: BomCategoryModel
}

class BomCategoryInternal<S extends BomCategoryState> extends React.Component<BomCategoryProps, S> {

  render() {
    if (this.bomCount(this.props.bomCategory.boms) === 0) {
      return (<></>)
    }

    return (
      <>
      <h3>{this.props.bomCategory.name}</h3>
      {this.renderBomGroups()}
      </>
    );
  }

  bomCount(boms: BomGroupModel[] = []): number {
    return boms.reduce((count: number, bom: BomGroupModel) => {
      return count + bom.boms.length;
    }, 0)
  }

  renderBomGroups() {
    if (this.props.bomCategory.boms.length === 0) {
      return (<div>No Boms</div>)
    }

    return this.props.bomCategory.boms.map(b => <BomGroup key={b.name} bomGroup={b}></BomGroup>)
  }

}

export const BomCategory = BomCategoryInternal
