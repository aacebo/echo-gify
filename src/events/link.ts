import { App, Event } from '@aacebo/echo';

export function link(app: App) {
  return async ({ event, ack }: { event: Event<'link'>, ack: () => void }) => {
    if (event.body.link.includes('.gif')) {
      await app.api.messages.extend(event.body.message_id, {
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
  };
}
