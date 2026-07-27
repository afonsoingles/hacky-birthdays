import { prisma } from '../db.js';

export function registerViews(app) {
    app.view('birthday_modal', async ({ ack, body, view, client }) => {
        await ack();
        const userId = body.user.id;
        const birthdayDate = view.state.values.birthday_date_block.birthday_date.selected_date;
        const shareAge = view.state.values.share_age_block.share_age_action.selected_option.value === 'share_age_allow';
        const channelId = JSON.parse(view.private_metadata).channelId;
        if (!birthdayDate) {
            try {
                await client.chat.postEphemeral({
                    channel: channelId,
                    user: userId,
                    text: ':confuse: Please set a birthday date, otherwise how do you think I will know when to wish you a happy birthday?'
                });
            } catch (err) {
                await client.chat.postMessage({
                    channel: userId,
                    text: ':confuse: Please set a birthday date, otherwise how do you think I will know when to wish you a happy birthday?'
                });
            }
            
            return;
        }
        
        const userInfo = await client.users.info({ user: userId });
        const timezone = userInfo.user.tz;

        const existing = await prisma.birthday.findUnique({
            where: { slackId: userId },
        });

        if (existing) {
            await prisma.birthday.update({
                where: { slackId: userId },
                data: {
                    date: new Date(birthdayDate),
                    timezone: timezone,
                    sendAge: shareAge,
                    lastAnnoundedYear: 1,
                },
            });
        } else {
            await prisma.birthday.create({
                data: {
                    slackId: userId,
                    date: new Date(birthdayDate),
                    timezone: timezone,
                    sendAge: shareAge,
                    lastAnnoundedYear: 1,
                },
            });
        }

        try {
            await client.chat.postEphemeral({
                channel: channelId,
                user: userId,
                text: ':birthday-parrot: Got it! I will wish you a happy birthday on your birthday!'
            });
        } catch (err) {
            await client.chat.postMessage({
                channel: userId,
                text: ':birthday-parrot: Got it! I will wish you a happy birthday on your birthday!'
            });
        }
    })
}