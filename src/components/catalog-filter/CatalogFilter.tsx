import React from 'react';
import {connect} from 'react-redux';
import {Button, Column, Grid, Row, Select, SelectItem, TextInput, Tooltip} from 'carbon-components-react';
import {Search16} from '@carbon/icons-react';

import './CatalogFilter.scss';
import {RootState} from '../../app/store';
import {filterCatalogAsync, selectCatalogFilters} from '../../features/catalog/catalogSlice';
import {CatalogFiltersModel} from '../../models';
import {CatalogListModel, ListValue} from '../../models/catalog-list.model';
import {fetchCatalogList, selectCatalogList} from '../../features/catalog-list/catalogListSlice';

interface CatalogFilterValues {
  catalogFilters?: CatalogFiltersModel;
  catalogList: CatalogListModel;
}

interface CatalogFilterDispatch {
  fetchCatalogList: () => void
  filterByCategory: (props: CatalogFilterProps, value: string) => void
  filterByCloudProvider: (props: CatalogFilterProps, value: string) => void
  filterBySoftwareProvider: (props: CatalogFilterProps, value: string) => void
  filterByModuleType: (props: CatalogFilterProps, value: string) => void
  filterByStatus: (props: CatalogFilterProps, value: string) => void
  filterBySearchText: (props: CatalogFilterProps, value: string) => void
}

export interface CatalogFilterProps extends CatalogFilterValues, CatalogFilterDispatch {
}

class CatalogFilterInternal extends React.Component<CatalogFilterProps, any> {
  _searchText = ''

  render() {
    this.searchText = this.props.catalogFilters?.searchText || ''

    return (
      <div className="CatalogFilter">
        <div className="FormElement">
          <Select
            id="categories"
            helperText="Filter by category"
            defaultValue={this.props.catalogFilters?.category || ''}
            labelText="Category"
            onChange={(e) => this.props.filterByCategory(this.props, e.target.value)}
          >
            {this.selectItems(this.props.catalogList.categoryValues)}
          </Select>
          <Select
            defaultValue={this.props.catalogFilters?.cloudProvider || ''}
            helperText="Filter by a cloud provider"
            id="cloudProviders"
            labelText="Cloud provider"
            onChange={(e) => this.props.filterByCloudProvider(this.props, e.target.value)}
          >
            {this.selectItems(this.props.catalogList.cloudProviderValues)}
          </Select>
        </div>
        <div className="FormElement">
          <Select
            defaultValue={this.props.catalogFilters?.softwareProvider || ''}
            helperText="Filter by a software provider"
            id="softwareProviders"
            labelText="Software provider"
            onChange={(e) => this.props.filterBySoftwareProvider(this.props, e.target.value)}
          >
            {this.selectItems(this.props.catalogList.softwareProviderValues)}
          </Select>
        </div>
        <div className="FormElement">
          <Select
            defaultValue={this.props.catalogFilters?.moduleType || ''}
            helperText="Filter by module type"
            id="moduleType"
            labelText="Module type"
            onChange={(e) => this.props.filterByModuleType(this.props, e.target.value)}
          >
            {this.selectItems(this.props.catalogList.moduleTypeValues)}
          </Select>
        </div>
        <div className="FormElement">
          <Select
            defaultValue={this.props.catalogFilters?.status || ''}
            helperText="Filter by status"
            id="status"
            labelText="Status"
            onChange={(e) => this.props.filterByStatus(this.props, e.target.value)}
          >
            {this.selectItems(this.props.catalogList.statusValues)}
          </Select>
        </div>
        <div className="FormElement">
          <Grid style={{paddingRight: '0', paddingLeft: '0'}}>
            <Row>
              <Column lg={{span: 9}} style={{paddingRight: '.5rem'}}>
                <TextInput
                  id="searchText"
                  labelText="Module search"
                  defaultValue={this.searchText}
                  onChange={(e) => this.searchText = e.target.value}
                />
              </Column>
              <Column lg={{span: 3}} style={{display: 'flex', paddingLeft: '.5rem'}}>
                <Button
                  className="SearchButton"
                  style={{display: 'inline-block', alignSelf: 'flex-end'}}
                  size={"field"}
                  onClick={(e) => this.props.filterBySearchText(this.props, this.searchText)}
                  renderIcon={Search16}
                  hasIconOnly
                />
              </Column>
            </Row>
          </Grid>
        </div>
      </div>
    )
  }

  get searchText(): string {
    return this._searchText
  }

  set searchText(searchText: string) {
    this._searchText = searchText
  }

  selectItems(selectItemData: Array<{value: string, text: string}>) {
    return selectItemData.map(p => <SelectItem key={p.value} text={p.text} value={p.value} />)
  }

  componentDidMount() {
    this.props.fetchCatalogList()
  }
}

const mapStateToProps = (state: RootState): CatalogFilterValues => {
  return {
    catalogFilters: selectCatalogFilters(state),
    catalogList: selectCatalogList(state)
  }
}

const dispatchFilterBy = (key: keyof CatalogFiltersModel, dispatch: any) => {
  return (props: CatalogFilterProps, value: string) => {
    const newFilter: CatalogFiltersModel = {};
    newFilter[key] = value;

    const newFilters: CatalogFiltersModel = Object.assign(
      {},
      props.catalogFilters,
      newFilter
    );

    console.log('Applying filters: ', newFilters)
    return dispatch(filterCatalogAsync(newFilters))
  }
}

const dispatchCatalogList = (dispatch: any) => {
  return () => dispatch(fetchCatalogList())
}

const mapDispatchToProps = (dispatch: any): CatalogFilterDispatch => {
  return {
    fetchCatalogList: dispatchCatalogList(dispatch),
    filterByCategory: dispatchFilterBy('category', dispatch),
    filterByCloudProvider: dispatchFilterBy('cloudProvider', dispatch),
    filterBySoftwareProvider: dispatchFilterBy('softwareProvider', dispatch),
    filterByModuleType: dispatchFilterBy('moduleType', dispatch),
    filterByStatus: dispatchFilterBy('status', dispatch),
    filterBySearchText: dispatchFilterBy('searchText', dispatch),
  }
}

export const CatalogFilter = connect(mapStateToProps, mapDispatchToProps)(CatalogFilterInternal);
