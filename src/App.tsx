import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {Content, Header, HeaderMenu, HeaderMenuItem, HeaderName, HeaderNavigation} from 'carbon-components-react';
import ReactGA from 'react-ga4';

import './app.scss';
import {CatalogPage, ContributingPage, BOMPage} from './pages';
import {HowToGitopsPage, HowToPage, HowToTerraformPage} from './pages/how-to';

class App extends React.Component<any, any> {

  componentDidMount() {
    ReactGA.initialize('G-6DPN305CX5');
  }

  render() {
    return (
      <div className="App">
        <Header aria-label="TechZone Deployer">
          <HeaderName href="#" prefix="">
            TechZone Deployer
          </HeaderName>
          <HeaderNavigation aria-label="TechZone Deployer">
            <HeaderMenuItem href="/">Module catalog</HeaderMenuItem>
            <HeaderMenuItem href="#/bom-catalog">BOM catalog</HeaderMenuItem>
            <HeaderMenuItem href="https://github.com/cloud-native-toolkit" target="_blank" rel="noopener noreferrer">Git organization</HeaderMenuItem>
            <HeaderMenuItem href="#/contributing">Contributing</HeaderMenuItem>
            <HeaderMenu aria-label="How to" menuLinkName="How To">
              <HeaderMenuItem href="#/how-to/terraform">Create a terraform module</HeaderMenuItem>
              <HeaderMenuItem href="#/how-to/gitops">Create a gitops module</HeaderMenuItem>
            </HeaderMenu>
          </HeaderNavigation>
        </Header>
        <Content>
          <HashRouter>
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/contributing" element={<ContributingPage />} />
              <Route path="/how-to" element={<HowToPage />} />
              <Route path="/how-to/terraform" element={<HowToTerraformPage />} />
              <Route path="/how-to/gitops" element={<HowToGitopsPage />} />
              <Route path="/bom-catalog" element={<BOMPage />} />
            </Routes>
          </HashRouter>
        </Content>
      </div>
    )
  }
}

export default App;
