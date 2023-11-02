import axios from 'axios';

const baseUrl = 'https://api.giphy.com/v1';

export class Gify {
  static async random(tag: string = '') {
    const res = await axios.get<{
      readonly data: {
        readonly id: string;
        readonly title: string;
        readonly url: string;
        readonly embed_url: string;
      };
    }>(
      `${baseUrl}/gifs/random?api_key=${process.env.GIFY_API_KEY}&tag=${tag}&rating=g`
    );

    return res.data.data;
  }
}
