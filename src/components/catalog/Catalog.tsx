import React from 'react';
import {connect} from 'react-redux';

import {RootState} from '../../app/store';
import {Category} from '../category';
import {Loading} from '../loading';
import {ModeToggle} from '../mode-toggle';

import {CatalogFiltersModel, CatalogModel} from '../../models';
import {
  filterCatalogAsync,
  selectCatalog,
  selectCatalogFilters,
  selectCatalogStatus
} from '../../features/catalog/catalogSlice';
import {Status} from '../../features/status';

interface CatalogValues {
  catalog?: CatalogModel
  filters?: CatalogFiltersModel
  status?: Status
}

interface CatalogDispatch {
  fetchCatalog: (filters?: CatalogFiltersModel) => void
}

export interface CatalogProps extends CatalogValues, CatalogDispatch {
}

class CatalogInternal extends React.Component<CatalogProps, any> {

  render() {
    return (
      <div className="Catalog">
        <ModeToggle />
        <Loading status={this.props.status} />
        {this.renderCatalog()}
      </div>
    )
  }

  renderStatus() {
    if (this.props.status === Status.loading) {
      return (<div>Loading...</div>)
    }

    return (<div></div>)
  }

  renderCatalog() {
    const catalog: CatalogModel | undefined = this.props.catalog

    if (!catalog) {
      return
    }

    return catalog.categories.map(c => <Category key={c.name} category={c} />)
  }

  componentDidMount() {
    this.props.fetchCatalog()
  }
}

const mapStateToProps = (state: RootState): CatalogValues => {

  const props = {
    catalog: selectCatalog(state),
    filters: selectCatalogFilters(state),
    status: selectCatalogStatus(state)
  }

  console.log('Refreshing props: ', props)

  return props
}

const mapDispatchToProps = (dispatch: any): CatalogDispatch => {
  return {
    fetchCatalog: (filters?: CatalogFiltersModel) => dispatch(filterCatalogAsync(filters))
  }
}

export const Catalog = connect(mapStateToProps, mapDispatchToProps)(CatalogInternal)
