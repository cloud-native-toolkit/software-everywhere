import React from 'react';
import {Column, Grid, Row} from 'carbon-components-react';
import {CatalogFilter} from '../../components/catalog-filter/CatalogFilter';
import {Catalog} from '../../components/catalog/Catalog';

class Main extends React.Component<any, any> {

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Column lg={{span: 12}} md={{span: 8}} sm={{span: 4}}>
              <h1>Automation modules</h1>
            </Column>
          </Row>
          <Row>
            <Column lg={{span: 2}} md={{span: 2}} sm={{span: 4}}>
              <CatalogFilter></CatalogFilter>
            </Column>
            <Column lg={{span: 10}} md={{span: 6}} sm={{span: 4}}>
              <Catalog></Catalog>
            </Column>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Main
