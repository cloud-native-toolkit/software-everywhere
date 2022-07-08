import React from 'react';
import ReactGA from 'react-ga4';
import {MarkdownView} from '../../../components/markdown-view';

export class HowToTerraformPage extends React.Component<any, any> {

  componentDidMount() {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }

  render() {
    return (
      <MarkdownView name="how-to-terraform" url="/md/how-to-terraform.md" />
    );
  }
}
