import { App, ActionHandlerArgs } from '@aacebo/echo';

export function submit(app: App) {
  return async ({ chat, user, value, ack }: ActionHandlerArgs<'button'>) => {
    await app.api.views.chats.draft(user.name, chat.id, {
      child: {
        type: 'container',
        child: {
          type: 'image',
          url: value
        }
      }
    });

    await app.api.views.dialogs.close(user.name, 'giphy');
    ack();
  };
}
