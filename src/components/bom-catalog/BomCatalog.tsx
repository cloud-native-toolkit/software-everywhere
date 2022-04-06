import React from 'react';
import {connect} from 'react-redux';

import {RootState} from '../../app/store';
import './BomCatalog.scss';

import {
  Tile,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Grid,
  Row,
  Column,
  ClickableTile,
} from 'carbon-components-react';

import {
  filterBomCatalogAsync,
  selectBomCatalog,
  selectBomCatalogStatus
} from '../../features/bomCatalog/bomCatalogSlice';

import {BomCategory} from '../bom-category';
import {Loading} from '../loading';

import {BomModel, BomCatalogModel, BomCatalogFiltersModel} from '../../models';

import {Status} from '../../features/status';

interface BomCatalogValues {
  bomCatalog?: BomCatalogModel
  filters?: BomCatalogFiltersModel
  status?: Status
}

interface BomCatalogDispatch {
  fetchBomCatalog: (filters?: BomCatalogFiltersModel) => void
}

export interface BomProps extends BomCatalogValues, BomCatalogDispatch {
}

class BomCatalogInternal extends React.Component<BomProps, any> {

  render() {
    return (
      <div>
        <Loading status={this.props.status} />
        {this.renderBomCatalog()}
      </div>
    )
  }

  renderStatus() {
    if (this.props.status === Status.loading) {
      return (<div>Loading...</div>)
    }

    return (<div></div>)
  }

  renderBomCatalog() {
    const bomCatalog: BomCatalogModel | undefined = this.props.bomCatalog

    if (!bomCatalog) {
      return
    }
    return bomCatalog.categories.map(c => <BomCategory key={c.name} bomCategory={c} />)
  }

  componentDidMount() {
    this.props.fetchBomCatalog()
  }
}

const mapStateToProps = (state: RootState): BomCatalogValues => {

  const props: BomCatalogValues = {
    bomCatalog: selectBomCatalog(state),
    status: selectBomCatalogStatus(state)
  }

  console.log('Refreshing props: ', props)

  return props
}

const mapDispatchToProps = (dispatch: any): BomCatalogDispatch => {
  return {
    fetchBomCatalog: (filters?: BomCatalogFiltersModel) => dispatch(filterBomCatalogAsync(filters))
  }
}

export const BomCatalog = connect(mapStateToProps, mapDispatchToProps)(BomCatalogInternal)
