import React from 'react';
import {Content, Header, HeaderMenu, HeaderMenuItem, HeaderName, HeaderNavigation} from 'carbon-components-react';

import './app.scss';
import {CatalogPage} from './pages';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ContributingPage} from './pages/contributing/ContributingPage';
import {HowToPage} from './pages/how-to/HowToPage';
import {HowToTerraformPage} from './pages/how-to/terraform/HowToTerraformPage';
import {HowToGitopsPage} from './pages/how-to/gitops/HowToGitopsPage';

class App extends React.Component<any, any> {

  render() {
    return (
      <div className="App">
        <Header aria-label="Automation modules">
          <HeaderName href="/" prefix="">
            Automation modules
          </HeaderName>
          <HeaderNavigation aria-label="Automation modules">
            <HeaderMenuItem href="/">Module catalog</HeaderMenuItem>
            <HeaderMenuItem href="/contributing">Contributing</HeaderMenuItem>
            <HeaderMenu aria-label="How to" menuLinkName="How To">
              <HeaderMenuItem href="/how-to/terraform">Create a terraform module</HeaderMenuItem>
              <HeaderMenuItem href="/how-to/gitops">Create a gitops module</HeaderMenuItem>
            </HeaderMenu>
          </HeaderNavigation>
        </Header>
        <Content>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/contributing" element={<ContributingPage />} />
              <Route path="/how-to" element={<HowToPage />} />
              <Route path="/how-to/terraform" element={<HowToTerraformPage />} />
              <Route path="/how-to/gitops" element={<HowToGitopsPage />} />
            </Routes>
          </BrowserRouter>
        </Content>
      </div>
    )
  }
}

export default App;
