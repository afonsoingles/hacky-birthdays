# Hack Birthdays
Hack Borthidays is a slackbot that posts about people's birthdays in a channel.

## How to use
You can use `/birthday config` to set or edit your birthday and `/birthaday delete` to delete it.
Birthday messages are sent at 9AM in your timezone.

### Run this locally
1. Start by cloning the repo.
`git clone https://gith.com/afonsoingles/hacky-birthdays``
2. Install the dependencies
`npm install`
3. Fill in the envs!
If you are running in development, you only need `SLACK_BOT_TOKEN`, `SLACK_APP_TOKEN`, `BIRTHDAY_CHANNEL_ID`, `BIRTHDAY_USERGROUP_ID` and `DATABASE_URL`. Socket mode must be turned on.
If you are running this in production, then you don't need the app token, but instead `SLACK_SIGNING_SECRET`
Please be aware that the DB url should be a MongoDB instance with replicas enabled (prisma requirement)

4. Run `npx prisma generate`
5. Start it using `npm run start` and have fun!
