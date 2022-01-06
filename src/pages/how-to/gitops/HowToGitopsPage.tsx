import React from 'react';
import {MarkdownView} from '../../../components/markdown-view';

export class HowToGitopsPage extends React.Component<any, any> {
  render() {
    return (
      <MarkdownView name="how-to-gitops" url="/md/how-to-gitops.md" />
    );
  }
}
