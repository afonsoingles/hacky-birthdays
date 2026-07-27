import 'dotenv/config';
import { App } from '@slack/bolt';
import { registerCommands } from './listeners/commands.js';
import { registerViews } from './listeners/views.js';
import { scheduleBirthdayWishes } from './cron.js';


const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: process.env.NODE_ENV !== 'production',
  appToken: process.env.SLACK_APP_TOKEN,
  customRoutes: [
    {
      path: '/health',
      method: ['GET'],
      handler: async (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      }
    }
  ]
});

registerCommands(app);
registerViews(app);


(async () => {
  await app.start({ port: process.env.PORT || 5873, host: '0.0.0.0' });
  scheduleBirthdayWishes(app);
  app.logger.info('It is running!');
})();
