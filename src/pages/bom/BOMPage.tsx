import React from 'react';
import {Column, Grid, Row} from 'carbon-components-react';
import ReactGA from 'react-ga4';

import {BomCatalog, BomFilter} from '../../components';

export class BOMPage extends React.Component<any, any> {

  componentDidMount() {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Column lg={{span: 12}} md={{span: 8}} sm={{span: 4}}>
              <h1>BOM catalog</h1>
            </Column>
          </Row>
          <Row>
            <Column lg={{span: 2}} md={{span: 2}} sm={{span: 4}}>
              <BomFilter />
            </Column>
            <Column lg={{span: 10}} md={{span: 6}} sm={{span: 4}}>
              <BomCatalog />
            </Column>
          </Row>
        </Grid>
      </div>
    );
  }
}
