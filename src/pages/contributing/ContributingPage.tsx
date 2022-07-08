import React from 'react';
import ReactGA from 'react-ga4';
import {MarkdownView} from '../../components/markdown-view';

export class ContributingPage extends React.Component<any, any> {

  componentDidMount() {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }

  render() {
    return (
      <MarkdownView name="contributing" url="/md/contributing.md" />
    );
  }
}
