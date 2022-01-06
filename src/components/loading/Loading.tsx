import React from 'react';
import {Status} from '../../features/status';

export interface LoadingProps {
  status?: Status
}

export class Loading extends React.Component<LoadingProps, any> {
  render() {
    if (this.props.status === Status.loading) {
      return (<div style={{fontSize: '3rem'}}>Loading...</div>)
    }

    return (<></>);
  }
}
