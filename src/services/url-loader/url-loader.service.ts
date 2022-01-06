
export class UrlLoaderService {
  async fetch(url: string): Promise<string> {
    const result = await fetch(url);
    const text = await result.text();

    return text;
  }
}
