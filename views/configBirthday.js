export function configBirthdayView(channelId) {
  return {
    type: 'modal',
    callback_id: 'birthday_modal',
    private_metadata: JSON.stringify({ channelId }),
    title: { type: 'plain_text', text: 'Set your birthday' },
    submit: { type: 'plain_text', text: 'Save' },
    close: { type: 'plain_text', text: 'Cancel' },
    blocks: [
      {
        type: 'input',
        block_id: 'birthday_date_block',
        element: {
          type: 'datepicker',
          action_id: 'birthday_date',
          placeholder: { type: 'plain_text', text: 'Select your birthday' },
        },
        label: { type: 'plain_text', text: "What's your birthday?" },
      },
      {
        type: 'input',
        block_id: 'share_age_block',
        element: {
          type: 'radio_buttons',
          action_id: 'share_age_action',
          options: [
            {
              text: { type: 'plain_text', text: 'Yes', emoji: true },
              value: 'share_age_allow',
            },
            {
              text: { type: 'plain_text', text: 'No', emoji: true },
              value: 'share_age_disallow',
            },
          ],
        },
        label: {
          type: 'plain_text',
          text: 'Do you want to share your age in the channel?',
          emoji: true,
        },
        optional: false,
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: "The Slack datepicker forces you to select a year. If you selected 'No' above, the year will be ignored.",
          },
        ],
      },
    ],
  };
}