import { App, models } from '@aacebo/echo';

export function submit(app: App) {
  return async ({ chat, user, value, ack }: { chat: models.Chat, user: models.User, value: any, ack: () => void }) => {
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
