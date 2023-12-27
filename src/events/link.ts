import { App, Event } from '@aacebo/echo';

export function link(app: App) {
  return async ({ event, ack }: { event: Event<'link'>, ack: () => void }) => {
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
  };
}
