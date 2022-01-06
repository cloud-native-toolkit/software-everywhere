import React from 'react';
import {MarkdownView} from '../../../components/markdown-view';

export class HowToTerraformPage extends React.Component<any, any> {
  render() {
    return (
      <MarkdownView name="how-to-terraform" url="/md/how-to-terraform.md" />
    );
  }
}
