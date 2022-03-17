import React from 'react';
import yaml from 'yaml';

import './Bom.scss';

import {
  Tile,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Grid,
  Row,
  Column,
  ClickableTile,
} from 'carbon-components-react';

import { bomCloudProvider, bomPath, bomName, BomModel } from '../../models';

export interface BomProps {
  bom: BomModel;
}

class BomInternal extends React.Component<BomProps, any> {

  state = {
    modules: [],
  };

  render() {
    return this.renderTile()
  }

  renderTile() {
    return (
      <div className="bx--grid">
        <div className="bx--row">
          <div className="bx--col, row-margin">
            <ClickableTile>
              <Grid>
                <Row>
                  <Column className="dimensions">
                    <Breadcrumb noTrailingSlash>
                      <BreadcrumbItem>
                        <a href="/">{this.bomCloudProvider}</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </Column>
                  <Column className="dimensions">
                    <Breadcrumb noTrailingSlash>
                      <BreadcrumbItem>
                        <a href="/">{this.bomName}</a>
                      </BreadcrumbItem>
                    </Breadcrumb>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <div className="custom">
                      {this.renderBomModules()}
                    </div>
                  </Column>
                </Row>
                <Row>
                  <Column className="button">
                    <a
                      href={this.bomPath}
                      download={this.bomYamlName}
                      target="_blank">
                      <Button className="button">Download</Button>
                    </a>
                    <Button className="button" disabled>Deploy</Button>
                  </Column>
                </Row>
              </Grid>
            </ClickableTile>
          </div>
        </div>
      </div>
    )
  }

  get bomCloudProvider(): string {
   return bomCloudProvider(this.props.bom)
  }

  get bomPath(): string {
   return bomPath(this.props.bom)
  }

  get bomYamlName(): string {
   let name: string = bomName(this.props.bom)
   return name + '.yaml'
  }

  get bomName(): string {
   return bomName(this.props.bom)
  }

  componentDidMount() {
    this.loadYaml();
  }

  async loadYaml() {
    const result = await fetch(this.bomPath);
    const text = await result.text();

    try {
      var bomModules = yaml.parse(text);
      var moduleArray=[];
      for (var key in bomModules.spec.modules) {
          var obj = bomModules.spec.modules[key].name;
          moduleArray.push(obj)
      }
      this.setState({ modules:  moduleArray});
    } catch (error) {
      console.log('Error parsing catalog: ', error)
      throw error
    }
  }

  renderBomModules() {
    var moduleArray = this.state.modules

    if (moduleArray.length === 0) {
      return (<div>No Modules</div>)
    }

    const bomModules = moduleArray.map((m) => <li>{m}</li>)

    return (
      <div className="text">
      {bomModules }
      </div>
    )
  }

}

export const Bom = BomInternal
