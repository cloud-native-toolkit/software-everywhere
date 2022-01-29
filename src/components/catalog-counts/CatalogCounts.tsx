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

  countView() {
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
      <>
        <div><div style={{fontWeight: 'bold', float: 'left'}}>Modules:</div> <div style={{width: '75px', float: 'left', paddingLeft: '10px'}}>{moduleCount()}</div></div>
      </>
    )
  }

  render() {

    return (
      <div style={{overflow: 'auto', width: '100%'}}>
        <div style={{float: 'right'}}>
          {this.countView()}
        </div>
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
