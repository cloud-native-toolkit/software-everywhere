import React from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import {connect} from 'react-redux';

import '@primer/css/markdown/index.scss'
import './MarkdownView.scss'
import {RootState} from '../../app/store';
import {fetchMarkdownAsync, selectMarkdown} from '../../features/markdown/markdownSlice';

interface MarkdownViewValues {
  markdown: {[name: string]: string}
}

interface MarkdownViewDispatch {
  fetchMarkdown: (values: {name: string, url: string}) => void
}

export interface MarkdownViewParams {
  name: string
  url: string
}

interface MarkdownViewCompositeParams extends MarkdownViewValues, MarkdownViewDispatch, MarkdownViewParams {
}

class MarkdownViewInternal extends React.Component<MarkdownViewCompositeParams, any> {
  render() {
    return (
      <ReactMarkdown className="markdown-body" children={this.props.markdown[this.props.name]} remarkPlugins={[remarkGfm]} />
    );
  }

  componentDidMount() {
    this.props.fetchMarkdown(this.props)
  }
}

const mapStateToProps = (state: RootState): MarkdownViewValues => {

  const props = {
    markdown: selectMarkdown(state) || {},
  }

  return props
}

const mapDispatchToProps = (dispatch: any): MarkdownViewDispatch => {
  return {
    fetchMarkdown: ({name, url}: {name: string, url: string}) => dispatch(fetchMarkdownAsync({name, url}))
  }
}

export const MarkdownView = connect(mapStateToProps, mapDispatchToProps)(MarkdownViewInternal)
