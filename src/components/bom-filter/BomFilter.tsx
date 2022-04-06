import React from 'react';
import {connect} from 'react-redux';
import {Button, Column, Grid, Row, Select, SelectItem, TextInput, Tooltip} from 'carbon-components-react';
import {Search16} from '@carbon/icons-react';

import './BomFilter.scss';
import {RootState} from '../../app/store';
import {filterBomCatalogAsync, selectBomCatalogFilters} from '../../features/bomCatalog/bomCatalogSlice';
import {BomCatalogFiltersModel} from '../../models';
import {BomCatalogListModel, ListValue} from '../../models/bom-catalog-list.model';
import {fetchBomCatalogList, selectBomCatalogList} from '../../features/bom-catalog-list/bomCatalogListSlice';

interface BomCatalogFilterValues {
  bomCatalogFilters?: BomCatalogFiltersModel;
  bomCatalogList: BomCatalogListModel;
}

interface BomCatalogFilterDispatch {
  fetchBomCatalogList: () => void
  filterByCategory: (props: BomCatalogFilterProps, value: string) => void
}

export interface BomCatalogFilterProps extends BomCatalogFilterValues, BomCatalogFilterDispatch {
}

class BomCatalogFilterInternal extends React.Component<BomCatalogFilterProps, any> {
  render() {
    return (
      <div className="CatalogFilter">
        <div className="FormElement">
          <Select
            id="categories"
            helperText="Filter by category"
            defaultValue={this.props.bomCatalogFilters?.category || ''}
            labelText="Category"
            onChange={(e) => this.props.filterByCategory(this.props, e.target.value)}
          >
            {this.selectItems(this.props.bomCatalogList.bomCategoryValues)}
          </Select>
        </div>
      </div>
    )
  }

  selectItems(selectItemData: Array<{value: string, text: string}>) {
    return selectItemData.map(p => <SelectItem key={p.value} text={p.text} value={p.value} />)
  }

  componentDidMount() {
    this.props.fetchBomCatalogList()
  }
}

const mapStateToProps = (state: RootState): BomCatalogFilterValues => {
  return {
    bomCatalogFilters: selectBomCatalogFilters(state),
    bomCatalogList: selectBomCatalogList(state)
  }
}

const dispatchFilterBy = (key: keyof BomCatalogFiltersModel, dispatch: any) => {
  return (props: BomCatalogFilterProps, value: string) => {
    const newFilter: BomCatalogFiltersModel = {};
    newFilter[key] = value;

    const newFilters: BomCatalogFiltersModel = Object.assign(
      {},
      props.bomCatalogFilters,
      newFilter
    );

    console.log('Applying filters: ', newFilters)
    return dispatch(filterBomCatalogAsync(newFilters))
  }
}

const dispatchBomCatalogList = (dispatch: any) => {
  return () => dispatch(fetchBomCatalogList())
}

const mapDispatchToProps = (dispatch: any): BomCatalogFilterDispatch => {
  return {
    fetchBomCatalogList: dispatchBomCatalogList(dispatch),
    filterByCategory: dispatchFilterBy('category', dispatch),
  }
}

export const BomFilter = connect(mapStateToProps, mapDispatchToProps)(BomCatalogFilterInternal);
