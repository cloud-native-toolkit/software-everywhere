import React from 'react';
import {Column, Grid, Row} from 'carbon-components-react';

import {BomCatalog} from '../../components';

export class BOMPage extends React.Component<any, any> {

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
            <Column lg={{span: 12}} md={{span: 8}} sm={{span: 4}}>
              <BomCatalog />
            </Column>
          </Row>
        </Grid>
      </div>
    );
  }
}
