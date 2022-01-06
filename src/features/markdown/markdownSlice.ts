import {Status} from '../status';
import {UrlLoaderService} from '../../services';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

export interface MarkdownState {
  value: {[name: string]: string}
  status: Status
}

const initialState: MarkdownState = {
  value: {},
  status: Status.idle
}

const service: UrlLoaderService = new UrlLoaderService();

export const fetchMarkdownAsync = createAsyncThunk(
  'markdown/fetch',
  async ({name, url}: {name: string, url: string}): Promise<{[name: string]: string}> => {
    console.log(`Fetching markdown: ${name}, ${url}`)
    const markdown = await service.fetch(url)

    const result: any = {}
    result[name] = markdown

    return result
  }
)

export const markdownSlice = createSlice({
  name: 'markdown',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarkdownAsync.pending, (state) => {
        console.log('Loading markdown')
        state.status = Status.loading
      })
      .addCase(fetchMarkdownAsync.fulfilled, (state, action: PayloadAction<{[name: string]: string}>) => {
        console.log('Markdown loaded')
        state.status = Status.idle
        state.value = Object.assign({}, state.value, action.payload)
      })
  }
})

export const selectMarkdown = (state: RootState): {[name: string]: string} | undefined => state.markdown.value

export const markdownReducer = markdownSlice.reducer
