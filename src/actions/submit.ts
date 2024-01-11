import { App, ActionHandlerArgs } from '@aacebo/echo';

export function submit(app: App) {
  return async ({ session_id, chat, value, ack }: ActionHandlerArgs<'button'>['chat']) => {
    try {
      await app.api.views.chats.draft(session_id, chat.id, {
        child: {
          type: 'image',
          url: value
        }
      });

      await app.api.views.dialogs.close(session_id, 'giphy');
    } catch (err) {
      app.log(err);
    }

    ack();
  };
}
