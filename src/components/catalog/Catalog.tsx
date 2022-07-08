import React from 'react';
import {connect} from 'react-redux';
import ReactGA from 'react-ga4';

import './Catalog.scss';
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
import {Button, Column, Grid, Row} from 'carbon-components-react';
import {CatalogCounts} from '../catalog-counts';

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
        <Grid style={{paddingTop: '10px', paddingBottom: '10px', paddingLeft: 0, paddingRight: 0}}>
          <Row>
            <Column>
              <a
                href="https://github.com/cloud-native-toolkit/automation-modules/issues/new?labels=new_module&template=new-module.md&title=Request+new+module%3A+%7Bname%7D"
                target="_blank"><Button size="field" onClick={() => ReactGA.event({category: 'User', action: 'Requested new module'})}>Request new module</Button></a>
            </Column>
            <Column>
              <CatalogCounts />
            </Column>
            <Column>
              <div style={{float: 'right'}}>
                <ModeToggle />
              </div>
            </Column>
          </Row>
        </Grid>
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

  const props: CatalogValues = {
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
