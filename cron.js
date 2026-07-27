import cron from 'node-cron';
import { DateTime } from 'luxon';
import { prisma } from './db.js';

export function scheduleBirthdayWishes(app) {
    cron.schedule('0 * * * *', async () => {
        try {
            await checkBirthdays(app);
        } catch (error) {
            console.error('Error checking birthdays:', error);
        }
    });
}

async function checkBirthdays(app) {
    console.log('Checking birthdays...');
    const birthdays = await prisma.birthday.findMany();

    for (const bday of birthdays) {

        const nowInUserTZ = DateTime.now().setZone(bday.timezone);
        const isBirthdayToday = nowInUserTZ.hasSame(DateTime.fromJSDate(bday.date).setZone(bday.timezone), 'day') && nowInUserTZ.hasSame(DateTime.fromJSDate(bday.date).setZone(bday.timezone), 'month');
        const wasAnnouncedThisYear = bday.lastAnnoundedYear === nowInUserTZ.year;
        const isAnnounceHour = nowInUserTZ.hour >= 9;
        console.log(`User: ${bday.slackId}, isBirthdayToday: ${isBirthdayToday}, wasAnnouncedThisYear: ${wasAnnouncedThisYear}, isAnnounceHour: ${isAnnounceHour}`);
        if (!isBirthdayToday) {
            console.log(`Not ${bday.slackId}'s birthday today.`);
            continue;
        }
        if (wasAnnouncedThisYear) {
            console.log(`Already announced ${bday.slackId}'s birthday this year.`);
            continue;
        }
        if (!isAnnounceHour) {
            console.log(`It's not the announce hour for ${bday.slackId}.`);
            continue;
        }
        console.log(`Announcing birthday for ${bday.slackId}...`);
        const birthdayYear = bday.date.getFullYear();

        const message = bday.sendAge && birthdayYear ?
        `:birthday-parrot::confetti_ball: Hey everyone! Today is <@${bday.slackId}>'s birthday! They are turning *${nowInUserTZ.year - birthdayYear}* years old! \n_Please wish them a happy birthday in the thread!_` :
        `:birthday-parrot::confetti_ball: Hey everyone! Today is <@${bday.slackId}>'s birthday! \n_Please wish them a happy birthday in the thread! :thread:_`;

        await prisma.birthday.update({
            where: { slackId: bday.slackId },
            data: { lastAnnoundedYear: nowInUserTZ.year }
        });

        await app.client.chat.postMessage({
            channel: process.env.BIRTHDAY_CHANNEL_ID,
            text: message
        })
        await app.client.chat.postMessage({
            channel: process.env.BIRTHDAY_CHANNEL_ID,
            text: `pinging <!subteam^${process.env.BIRTHDAY_USERGROUP_ID}>. bing bong! :star: Please type in the thread above ^^`,
            blocks: [
                {
                    type: 'context',
                    elements:[ {
                        type: 'mrkdwn',
                        text: `pinging <!subteam^${process.env.BIRTHDAY_USERGROUP_ID}>. bing bong! :star: Please type in the thread above ^^`
                    }]
                }
            ]
        })
    }
}