import {CatalogModel} from '../../models';
import React from 'react';
import {RootState} from '../../app/store';
import {selectCatalog, selectCatalogCount, selectCatalogTotalCount} from '../../features/catalog/catalogSlice';
import {connect} from 'react-redux';

export interface CatalogCountProps {
  count?: number,
  totalCount?: number
}

class CatalogCountsInternal extends React.Component<CatalogCountProps, any> {

  render() {
    if (this.props.count === undefined || this.props.totalCount === undefined) {
      return (
        <>&nbsp;</>
      )
    }

    const moduleCount = (): string => {
      if (this.props.count === this.props.totalCount) {
        return `${this.props.totalCount}`
      }

      return `${this.props.count} / ${this.props.totalCount}`
    }

    return (
      <div style={{paddingTop: '10px', margin: 'auto', width: '225px'}}>
        <div style={{fontWeight: 'bold', width: '125px', float: 'left', paddingRight: '5px', fontSize: 'x-large', textAlign: 'right'}}>{moduleCount()}</div>
        <div style={{float: 'left', fontSize: 'x-large'}}>modules</div>
      </div>
    )
  }
}


const mapStateToProps = (state: RootState): CatalogCountProps => {

  const props: CatalogCountProps = {
    count: selectCatalogCount(state),
    totalCount: selectCatalogTotalCount(state)
  }

  return props
}

export const CatalogCounts = connect(mapStateToProps)(CatalogCountsInternal)
