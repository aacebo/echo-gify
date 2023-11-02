import { App } from '@aacebo/echo';

import { Gify } from './gify';

if (!process.env.CLIENT_ID) {
  throw new Error('`CLIENT_ID` is required');
}

if (!process.env.CLIENT_SECRET) {
  throw new Error('`CLIENT_SECRET` is required');
}

if (!process.env.GIFY_API_KEY) {
  throw new Error('`GIFY_API_KEY` is required')
}

const app = new App({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.action('onSave', ({ block_id, user, value, ack }) => {
  console.log(`@${user.name} executed "onClick" action from block "${block_id}" with value "${value}"`);
  ack();
});

app.action('onClick', async ({ block_id, user, value, ack }) => {
  console.log(`@${user.name} executed "onClick" action from block "${block_id}" with value "${value}"`);

  await app.api.views.dialogs.open(user.name, {
    id: '1',
    body: {
      type: 'column',
      children: [
        {
          type: 'input',
          label: {
            type: 'text',
            text: 'Username'
          },
          default_value: user.name
        },
        {
          type: 'input',
          label: {
            type: 'text',
            text: 'Phone'
          },
          default_value: user.phone
        }
      ]
    },
    submit: {
      type: 'text',
      text: 'Save'
    },
    onSubmit: 'onSave'
  });

  ack();
});

app.action('onChatChange', ({ block_id, user, value, ack }) => {
  console.log(`@${user.name} executed "onChatChange" action from block "${block_id}" with value "${value}"`);
  ack();
});

app.command('random', async ({ chat, user, input, ack }) => {
  const gif = await Gify.random(input);

  await app.api.messages.createFor(user.name, chat.id, {
    child: {
      type: 'container',
      child: {
        type: 'column',
        children: [
          {
            type: 'image',
            url: `https://media2.giphy.com/media/${gif.id}/giphy.gif`
          },
          {
            type: 'button',
            style: 'secondary',
            child: {
              type: 'text',
              text: 'Click Me!'
            },
            on_click: 'onClick'
          },
          {
            type: 'chat_select',
            label: {
              type: 'text',
              text: 'Chat'
            },
            on_change: 'onChatChange'
          }
        ]
      }
    }
  });

  ack();
});

app.start();
