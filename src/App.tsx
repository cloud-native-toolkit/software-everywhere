import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {Content, Header, HeaderMenu, HeaderMenuItem, HeaderName, HeaderNavigation} from 'carbon-components-react';

import './app.scss';
import {CatalogPage, ContributingPage} from './pages';
import {HowToGitopsPage, HowToPage, HowToTerraformPage} from './pages/how-to';

class App extends React.Component<any, any> {

  render() {
    return (
      <div className="App">
        <Header aria-label="Automation modules">
          <HeaderName href="#" prefix="">
            Automation modules
          </HeaderName>
          <HeaderNavigation aria-label="Automation modules">
            <HeaderMenuItem href="/">Module catalog</HeaderMenuItem>
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
            </Routes>
          </HashRouter>
        </Content>
      </div>
    )
  }
}

export default App;
