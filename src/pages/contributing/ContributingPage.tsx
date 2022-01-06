import React from 'react';
import {MarkdownView} from '../../components/markdown-view';

export class ContributingPage extends React.Component<any, any> {
  render() {
    return (
      <MarkdownView name="contributing" url="/md/contributing.md" />
    );
  }
}
