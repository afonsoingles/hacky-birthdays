import { configBirthdayView } from '../views/configBirthday.js'
import { prisma } from '../db.js'

export function registerCommands(app) {
    app.command('/birthday', async ({ ack, body, client, respond }) => {
        await ack();

        const [subcommand] = body.text.trim().split(/\s+/);

        switch (subcommand?.toLowerCase()) {
            case 'config':
                await client.views.open({
                    trigger_id: body.trigger_id,
                    view: configBirthdayView(body.channel_id)
                })
                break;
            case 'delete':
                const exists = await prisma.birthday.findUnique({
                    where: { slackId: body.user_id }
                })

                if (!exists) {
                    await respond({
                        response_type: 'ephemeral',
                        text: ':confuse: You have not set a birthday yet. Use `/birthday config` to set your birthday.'
                    })
                    return;
                }

                await prisma.birthday.delete({
                    where: { slackId: body.user_id }
                })

                await respond({
                    response_type: 'ephemeral',
                    text: ':sadgecry: Okay, I deleted your birthday. If you ever want to set it again, just use `/birthday config`.'
                })
                break;
            default:
                await respond({
                    response_type: 'ephemeral',
                    text: ':what-nobg: I could not understand that. You can use `/birthday config` to set/edit your birthday or `/birthday delete` to delete it.'
                })
        }
    })
}