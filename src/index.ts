import { App, blocks } from '@aacebo/echo';
import { GiphyFetch } from '@giphy/js-fetch-api';

if (!process.env.CLIENT_ID) {
  throw new Error('`CLIENT_ID` is required');
}

if (!process.env.CLIENT_SECRET) {
  throw new Error('`CLIENT_SECRET` is required');
}

if (!process.env.GIFY_API_KEY) {
  throw new Error('`GIFY_API_KEY` is required')
}

const gify = new GiphyFetch(process.env.GIFY_API_KEY);
const app = new App({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.event('link', async ({ event, ack }) => {
  if (event.body.link.includes('.gif')) {
    const message = await app.api.messages.getById(event.body.message_id);

    await app.api.messages.extend(message.id, {
      body: {
        type: 'container',
        child: {
          type: 'image',
          url: event.body.link
        }
      }
    });
  }

  ack();
});

app.shortcut('random', async ({ chat, user, ack }) => {
  const gifs = await gify.trending({
    type: 'gifs',
    limit: 15
  });

  let idx = 0;
  const rows: blocks.Row[] = [];

  for (let i = 0; i < 5; i++) {
    const row: blocks.Row = {
      type: 'row',
      children: []
    };

    while (idx < gifs.data.length) {
      row.children.push({
        type: 'button',
        child: {
          type: 'image',
          url: gifs.data[idx].images.downsized_medium.url
        },
        on_click: {
          action: 'submit',
          value: gifs.data[idx].images.downsized_medium.url
        }
      });

      idx++;

      if (idx % 3 == 0) {
        rows.push(row);
        break;
      }
    }
  }

  await app.api.views.dialogs.open(user.name, {
    id: 'giphy',
    type: 'chat',
    context_id: chat.id,
    title: {
      type: 'text',
      text: 'Random Gif'
    },
    body: {
      type: 'column',
      children: [
        {
          type: 'input',
          placeholder: {
            type: 'text',
            text: 'Search...'
          },
          on_submit: {
            action: 'search'
          }
        },
        {
          type: 'spacer'
        },
        ...rows
      ]
    }
  });

  ack();
});

app.action('search', async ({ chat, user, value, ack }) => {
  const gifs = await gify.search(value.text, {
    type: 'gifs',
    explore: true,
    limit: 15
  });

  let idx = 0;
  const rows: blocks.Row[] = [];

  for (let i = 0; i < 5; i++) {
    const row: blocks.Row = {
      type: 'row',
      children: []
    };

    while (idx < gifs.data.length) {
      row.children.push({
        type: 'button',
        child: {
          type: 'image',
          url: gifs.data[idx].images.downsized_medium.url
        },
        on_click: {
          action: 'submit',
          value: gifs.data[idx].images.downsized_medium.url
        }
      });

      idx++;

      if (idx % 3 == 0) {
        rows.push(row);
        break;
      }
    }
  }

  await app.api.views.dialogs.open(user.name, {
    id: 'giphy',
    type: 'chat',
    context_id: chat.id,
    title: {
      type: 'text',
      text: 'Random Gif'
    },
    body: {
      type: 'column',
      children: [
        {
          type: 'input',
          placeholder: {
            type: 'text',
            text: 'Search...'
          },
          default_value: value.text,
          on_submit: {
            action: 'search'
          }
        },
        {
          type: 'spacer'
        },
        ...rows
      ]
    }
  });

  ack();
});

app.action('submit', async ({ chat, user, value, ack }) => {
  await app.api.messages.createFor(user.name, chat.id, {
    child: {
      type: 'container',
      child: {
        type: 'image',
        url: value,
      }
    }
  });

  await app.api.views.dialogs.close(user.name, 'giphy');
  ack();
});

app.start();
