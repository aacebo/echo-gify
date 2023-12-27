import { App } from '@aacebo/echo';
import { GiphyFetch } from '@giphy/js-fetch-api';

import * as actions from './actions';
import * as events from './events';
import * as shortcuts from './shortcuts';

if (!process.env.CLIENT_ID) {
  throw new Error('`CLIENT_ID` is required');
}

if (!process.env.CLIENT_SECRET) {
  throw new Error('`CLIENT_SECRET` is required');
}

if (!process.env.GIPHY_API_KEY) {
  throw new Error('`GIPHY_API_KEY` is required')
}

const giphy = new GiphyFetch(process.env.GIPHY_API_KEY);
const app = new App({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.event('link', events.link(app));
app.shortcut('random', shortcuts.random(app, giphy));
app.action('search', actions.search(app, giphy));
app.action('submit', actions.submit(app));
app.start();
