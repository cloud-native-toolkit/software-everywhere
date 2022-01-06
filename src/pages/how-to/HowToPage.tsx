import React from 'react';
import {MarkdownView} from '../../components/markdown-view';

export class HowToPage extends React.Component<any, any> {
  render() {
    return (
      <MarkdownView name="how-to" url="/md/how-to.md" />
    );
  }
}
